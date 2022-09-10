import { useLayoutEffect, useRef, useState } from "react";
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
import TrackingModel from "../models/tracking";
import { Swipeable } from "react-native-gesture-handler";
import NewTrackingForm from "../components/NewTrackingForm";

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
        id={item.id}
        name={item.name}
        lastOccurrenceTime={item.lastOccurrenceTime()}
      />
    </Swipeable>
  );
}

export default function TrackingsScreen({ navigation }) {
  // useMemo() to fetch from API
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [trackings, setTrackings] = useState(TrackingModel.all());

  const showModal = () => {
    setTrackingModalVisible(true);
  };
  const hideModal = () => {
    setTrackingModalVisible(false);
  };
  const showSnackbar = () => {
    setSnackbarVisible(true);
  };
  const hideSnackbar = () => {
    setSnackbarVisible(false);
  };

  const handleAddNewTracking = () => {
    // show modal
    showModal();
  };

  const handleCreateTracking = (name) => {
    // create tracking
    const newTracking = new TrackingModel({
      name,
      id: Math.random().toString(),
      occurrences: [],
    });
    setTrackings((currentTrackings) => [newTracking, ...currentTrackings]);
    // hide modal
    hideModal();
    showSnackbar();
  };

  const handleTracking = (tracking) => {
    tracking.track();
    setTrackings([...trackings]);
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
          <NewTrackingForm
            isEditing={trackingModalVisible}
            onCreate={handleCreateTracking}
            onCancel={hideModal}
          />
        </Modal>
      </Portal>
      <Text style={styles.helpText}>Swipe left to track</Text>
      <FlatList
        style={styles.listContainer}
        data={trackings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrackingListItemSwipeable
            onSwipeRight={handleTracking}
            item={item}
          />
        )}
        ItemSeparatorComponent={() => <Divider />}
      />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={hideSnackbar}
        duration={3000}
        action={{
          label: "Ok",
          onPress: hideSnackbar,
        }}
      >
        Tracking added
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
