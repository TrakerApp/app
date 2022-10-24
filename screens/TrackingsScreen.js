import { useContext, useLayoutEffect, useRef, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Animated,
  RefreshControl,
} from "react-native";
import {
  IconButton,
  Text,
  Divider,
  Modal,
  Portal,
  Snackbar,
} from "react-native-paper";
import TrackingListItem from "../components/TrackingListItem";
import { Swipeable } from "react-native-gesture-handler";
import TrackingForm from "../components/TrackingForm";
import { TrackingsContext } from "../store/context/trackings-context";
import useColors from "../util/hooks/useColors";

const MESSAGES = {
  TrackingCreated: "Tracking added",
  Tracked: "Tracked successfully",
  error: "There was an error on your request, please try again later",
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
      <Text style={styles.trackSwipeButton}>TRACK</Text>
    </Animated.View>
  );
}

function NoTrackingsView() {
  return (
    <Text style={styles.noTrackingsText}>
      You don't have any tracking yet, you can add behaviours or habits that you
      want to keep track of by clicking on the plus icon on the top right
      corner.
    </Text>
  );
}

function TrackingListItemSwipeable({ onSwipeRight, item }) {
  const swipeableRef = useRef(null);

  const handleSwipe = (direction) => {
    if (direction === "right") {
      onSwipeRight(item);
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
      <TrackingListItem
        trackingId={item.trackingId}
        name={item.name}
        lastOccurrenceAt={item.lastOccurrenceAt}
      />
    </Swipeable>
  );
}

export default function TrackingsScreen({ navigation }) {
  // useMemo() to fetch from API
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [error, setError] = useState("");
  const trackingsCtx = useContext(TrackingsContext);
  const colors = useColors()

  const showModal = () => {
    setTrackingModalVisible(true);
  };
  const hideModal = () => {
    setTrackingModalVisible(false);
  };
  const hideSnackbar = () => {
    setSnackbarMessage("");
  };

  const handleAddNewTracking = () => {
    // show modal
    showModal();
  };

  const handleSaveButtonPress = async (tracking) => {
    // create tracking
    setLoading(true);
    setError("");
    const { status, data } = await trackingsCtx.createTracking(tracking);
    if (status === 201) {
      // hide modal
      hideModal();
      setSnackbarMessage(MESSAGES.TrackingCreated);
    } else {
      setError(
        data.error.toString().match(/tracking.name.already.exists/)
          ? "Tracking name already exists"
          : "Error when creating the tracking, please try again later"
      );
    }
    setLoading(false);
    return { status, data };
  };

  const handleTracking = async (tracking) => {
    // no setLoading here because user can do other actions like create tracking meanwhile
    const res = await trackingsCtx.track({ trackingId: tracking.trackingId });

    if (res.status === 201) {
      setSnackbarMessage(MESSAGES.Tracked);
    } else if (res.status >= 400 && res.status !== 401) {
      setSnackbarMessage(MESSAGES.error);
    }

    return res;
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton icon="plus" onPress={handleAddNewTracking} />
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.rootContainer}>
      <Portal>
        <Modal visible={trackingModalVisible} onDismiss={hideModal}>
          <TrackingForm
            title="Add new tracking"
            loading={loading}
            error={error}
            focusInput={trackingModalVisible}
            onSave={handleSaveButtonPress}
            onCancel={hideModal}
          />
        </Modal>
      </Portal>
      {trackingsCtx.trackings.length === 0 && !trackingsCtx.refreshing ? (
        <NoTrackingsView />
      ) : (
        <>
          <Text style={styles.helpText}>Swipe left to track</Text>
          <FlatList
            style={styles.listContainer}
            data={trackingsCtx.trackings}
            refreshControl={
              <RefreshControl
                tintColor={colors.refreshIndicator}
                refreshing={trackingsCtx.refreshing}
                onRefresh={trackingsCtx.refreshTrackings}
              />
            }
            keyExtractor={(item) => item.trackingId}
            renderItem={({ item }) => (
              <TrackingListItemSwipeable
                onSwipeRight={handleTracking}
                item={item}
              />
            )}
            ItemSeparatorComponent={() => <Divider />}
            onEndReachedThreshold={0.2}
            onEndReached={trackingsCtx.loadMoreTrackings}
          />
        </>
      )}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingTop: 20,
  },
  listContainer: {
    flex: 1,
    width: "100%",
    marginTop: 20,
  },
  helpText: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
  },
  noTrackingsText: {
    fontSize: 20,
    color: "#999",
    marginTop: 20,
    marginHorizontal: 20,
    textAlign: "center",
  },
  swipeableActionsContainer: {
    width: 100,
    backgroundColor: "#4caf50",
    justifyContent: "center",
    alignItems: "center",
  },
  trackSwipeButton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
