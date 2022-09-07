import { useRef } from 'react';
import { StyleSheet, SafeAreaView, FlatList, View } from "react-native";
import { Text, Divider } from "react-native-paper";
import TrackingListItem from "../components/TrackingListItem";
import TRACKINGS from "../data/trackings";
import { Swipeable } from "react-native-gesture-handler";

function swipeableRightActions(progress, dragX) {
  // const trans = dragX.interpolate({
  //   inputRange: [0, 50, 100, 101],
  //   outputRange: [-20, 0, 0, 1],
  // });
  return (
    // TODO: Theme based background coloring
    <View style={styles.swipeableActionsContainer}>
      <Text style={{}}>TRACK</Text>
    </View>
  );
}

function TrackingListItemSwipeable({ item }) {
  const swipeableRef = useRef(null);

  const handleSwipe = (direction) => {
    if (direction === 'right') {
      console.log("TRACK ME!")
      swipeableRef.current.close()
    }
  }

  return (
    <Swipeable ref={swipeableRef} renderRightActions={swipeableRightActions} leftThreshold={100} rightThreshold={100} onSwipeableOpen={handleSwipe}>
      <TrackingListItem
        name={item.name}
        lastOccurrence={item.occurrences?.[0]?.time}
      />
    </Swipeable>
  );
}

export default function TrackingsScreen() {
  return (
    <SafeAreaView style={styles.rootContainer}>
      <Text style={styles.helpText}>Swipe left to track</Text>
      <FlatList
        style={styles.listContainer}
        data={TRACKINGS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TrackingListItemSwipeable item={item} />}
        ItemSeparatorComponent={() => <Divider />}
      />
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
