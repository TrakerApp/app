import {
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
} from "react";
import { FlatList, StyleSheet, Animated, View } from "react-native";
import {
  Button,
  IconButton,
  Text,
  Portal,
  Modal,
  Snackbar,
  Divider,
} from "react-native-paper";
import { TrackingsContext } from "../store/context/trackings-context";
import useColors from "../util/hooks/useColors";
import TrackingForm from "../components/TrackingForm";
import { Swipeable } from "react-native-gesture-handler";
import { localTime } from "../util/localTime";

const MESSAGES = {
  TrackingUpdated: "Tracking name changed",
  Tracked: "Tracked successfully",
  OccurrenceRemoved: "Occurrence removed",
  error: "There was an error on your request, please try again later",
};

const OCCURRENCES_PER_PAGE = 20;

const getPluralSingular = (count, singular, plural) => {
  if (count === null) {
    return "";
  }

  const text = count === 1 ? singular : plural;
  return `${count} ${text}`;
};

function swipeableRightActions(progress, dragX) {
  const transform = dragX.interpolate({
    inputRange: [-101, -100, 0],
    outputRange: [0, 0, 100],
  });
  return (
    <Animated.View
      style={[
        styles.swipeableActionsContainer,
        {
          transform: [{ translateX: transform }],
        },
      ]}
    >
      <Text style={styles.deleteSwipeButton}>Delete</Text>
    </Animated.View>
  );
}

function OccurrenceItemSwipeable({ onSwipeRight, occurrence }) {
  const swipeableRef = useRef(null);

  const handleSwipe = (direction) => {
    if (direction === "right") {
      onSwipeRight(occurrence);
      swipeableRef.current.close();
    }
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={swipeableRightActions}
      leftThreshold={100}
      rightThreshold={100}
      onSwipeableOpen={handleSwipe}
    >
      <Text style={styles.occurrence}>{localTime(occurrence.createdAt)}</Text>
    </Swipeable>
  );
}

export default function TrackingScreen({ navigation, route }) {
  const trackingsCtx = useContext(TrackingsContext);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [occurrences, setOccurrences] = useState([]);
  const [error, setError] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colors = useColors();
  const { trackingId, name } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          size={32}
          icon="chevron-left"
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
    });
  }, [navigation]);

  // reset state
  useLayoutEffect(() => {
    setOccurrences([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [trackingId]);

  const refreshScreen = () => {
    setLoading(true);
    setRefreshing(true);
    setCurrentPage(1);
    setHasMore(true);
    trackingsCtx.findTracking(trackingId).then((res) => {
      const { status, data } = res;
      if (status === 200) {
        setTracking(data);
      }
    });

    trackingsCtx
      .listOccurrences({ trackingId, page: 1, perPage: OCCURRENCES_PER_PAGE })
      .then((res) => {
        const { status, data } = res;
        if (status === 200) {
          if (data.page >= data.totalPages) {
            setHasMore(false);
          }
          setOccurrences(data.occurrences);
        } else {
          console.log("error on fetch occurrences:", status, data);
        }
        setLoading(false);
        setRefreshing(false);
      });
  };

  useLayoutEffect(() => {
    setLoading(true);
    setRefreshing(true);
    // real data is loaded below after "loading"
    setTracking({
      trackingId,
      name,
      todayOccurrences: null,
      weekOccurrences: null,
    });
    setOccurrences([]);
  }, [trackingId, name]);

  useEffect(() => {
    refreshScreen();
  }, [trackingId]);

  if (!tracking) {
    return <Text>Loading...</Text>;
  }

  const loadMoreOccurrences = async () => {
    if (refreshing || !hasMore) {
      return;
    }
    setRefreshing(true);

    const newPage = currentPage + 1;

    const { status, data } = await trackingsCtx.listOccurrences({
      trackingId,
      page: newPage,
      perPage: OCCURRENCES_PER_PAGE,
    });
    if (status === 200) {
      if (data.page >= data.totalPages) {
        setHasMore(false);
      }
      setCurrentPage(newPage);
      setOccurrences([...occurrences, ...data.occurrences]);
    } else {
      console.log("error on fetch occurrences:", status, data);
    }
    setRefreshing(false);
  };

  const hideSnackbar = () => {
    setSnackbarMessage("");
  };

  const handleTrack = async () => {
    setLoading(true);
    const { status, data } = await trackingsCtx.track({
      trackingId: trackingId,
    });

    if (status === 201) {
      setTracking({
        ...tracking,
        todayOccurrences: tracking.todayOccurrences + 1,
        weekOccurrences: tracking.weekOccurrences + 1,
      });

      setOccurrences((prevOccurrences) => [
        { occurrenceId: data.occurrenceId, createdAt: data.createdAt },
        ...prevOccurrences,
      ]);

      setSnackbarMessage(MESSAGES.Tracked);
    } else if (status === 401) {
      // managed on auth context, user will be sign out automatically
      return;
    } else {
      console.log("error on TrackingScreen.handleTrack:", status, data);
      setSnackbarMessage(MESSAGES.error);
    }
    setLoading(false);
  };

  const showModal = () => setEditModalVisible(true);
  const hideModal = () => setEditModalVisible(false);

  const handleSaveName = async ({ name }) => {
    setLoading(true);
    setError("");
    const { status, data } = await trackingsCtx.updateTracking({
      trackingId,
      name,
    });

    if (status === 201) {
      setTracking((prevTracking) => ({ ...prevTracking, name }));
      hideModal();
      setSnackbarMessage(MESSAGES.TrackingUpdated);
    } else {
      setError(
        data.error.toString().match(/tracking.name.already.exists/)
          ? "Tracking name already exists"
          : "Error when updating the tracking, please try again later"
      );
    }
    setLoading(false);
    return { status, data };
  };

  const handleRemoveOccurrence = async (occurrence) => {
    setLoading(true);
    const { status, data } = await trackingsCtx.removeOccurrence({
      trackingId,
      occurrenceId: occurrence.occurrenceId,
    });

    if (status === 204) {
      refreshScreen();
      setSnackbarMessage(MESSAGES.OccurrenceRemoved);
    } else {
      console.log(
        "error on TrackingScreen.handleRemoveOccurrence:",
        status,
        data
      );
      setSnackbarMessage(MESSAGES.error);
    }
    setLoading(false);
  };

  const hasOccurrences = occurrences.length > 0;

  return (
    <View style={styles.rootContainer}>
      <Portal>
        <Modal visible={editModalVisible} onDismiss={hideModal}>
          <TrackingForm
            title="Edit Tracking"
            error={error}
            loading={loading}
            defaultValues={{ name: tracking.name }}
            focusInput={editModalVisible}
            onSave={handleSaveName}
            onCancel={hideModal}
            showHelp={false}
            buttonLabel="Save"
          />
        </Modal>
      </Portal>

      <Text style={styles.title}>{tracking.name}</Text>
      <View style={styles.buttonsContainer}>
        <Button
          style={styles.button}
          disabled={loading}
          mode="outlined"
          onPress={showModal}
        >
          Edit
        </Button>
        <Button
          style={styles.button}
          disabled={loading}
          mode="outlined"
          onPress={handleTrack}
        >
          Track
        </Button>
      </View>
      <View style={styles.infoContainer}>
        <View>
          <Text style={[styles.infoTitle, styles.info]}>Today</Text>
          <Text style={styles.info}>
            {getPluralSingular(tracking.todayOccurrences, "time", "times")}
          </Text>
        </View>
        <View>
          <Text style={[styles.infoTitle, styles.info]}>This week</Text>
          <Text style={styles.info}>
            {getPluralSingular(tracking.weekOccurrences, "time", "times")}
          </Text>
        </View>
      </View>
      <View style={styles.historyContainer}>
        <Text style={styles.subtitle}>History</Text>
        <Text style={[styles.helpText, { color: colors.helpText }]}>
          Swipe left to remove an occurrence
        </Text>
        {hasOccurrences && (
          <FlatList
            style={styles.listContainer}
            data={occurrences}
            keyExtractor={(item) => item.occurrenceId}
            renderItem={({ item }) => (
              <OccurrenceItemSwipeable
                occurrence={item}
                onSwipeRight={handleRemoveOccurrence}
              />
            )}
            ItemSeparatorComponent={() => <Divider />}
            onEndReachedThreshold={0.2}
            onEndReached={loadMoreOccurrences}
          />
        )}
        {!hasOccurrences && (
          <Text style={[styles.helpText, { color: colors.helpText }]}>
            No occurrences yet
          </Text>
        )}
      </View>

      <Snackbar
        visible={snackbarMessage !== ""}
        onDismiss={hideSnackbar}
        duration={3000}
        action={{
          label: "Ok",
          onPress: hideSnackbar,
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    paddingTop: 20,
    justifyContent: "space-around",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  historyContainer: {
    flex: 1,
    marginLeft: 20,
    marginTop: 20,
  },
  infoTitle: {
    fontWeight: "bold",
  },
  info: {
    fontSize: 20,
    marginTop: 10,
    textAlign: "center",
  },
  button: {
    paddingHorizontal: 28,
  },
  title: {
    paddingTop: 20,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  helpText: {
    fontSize: 16,
    marginTop: 5,
  },
  swipeableActionsContainer: {
    width: 100,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteSwipeButton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  occurrence: {
    paddingVertical: 10,
  },
});
