import { useContext, useLayoutEffect, useRef, useState } from "react";
import { StyleSheet, SafeAreaView, FlatList, View } from "react-native";
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

const MESSAGES = {
  TrackingCreated: "Tracking added",
  Tracked: "Tracked successfully",
  error: "There was an error on your request, please try again later",
};

function swipeableRightActions(progress, dragX) {
  // const trans = dragX.interpolate({
  //   inputRange: [0, 50, 100, 101],
  //   outputRange: [-20, 0, 0, 1],
  // });
  return (
    <View style={styles.swipeableActionsContainer}>
      <Text style={{}}>TRACK</Text>
    </View>
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
      <Text style={styles.helpText}>Swipe left to track</Text>
      <FlatList
        style={styles.listContainer}
        data={trackingsCtx.trackings}
        keyExtractor={(item) => item.trackingId}
        renderItem={({ item }) => (
          <TrackingListItemSwipeable
            onSwipeRight={handleTracking}
            item={item}
          />
        )}
        ItemSeparatorComponent={() => <Divider />}
      />
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
  swipeableActionsContainer: {
    width: 100,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 10,
  },
});
