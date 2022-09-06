import { StyleSheet, View, ScrollView } from "react-native";
import { Text, Divider } from "react-native-paper";
import TrackingListItem from "../components/TrackingListItem";
import TRACKINGS from "../data/trackings";

export default function TrackingsScreen() {
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.helpText}>Swipe left to track</Text>
      <ScrollView style={styles.listContainer}>
        {TRACKINGS.map((tracking) => (
          <>
            <TrackingListItem
              key={tracking.id}
              name={tracking.name}
              lastOccurrence={tracking.occurrences?.[0]?.time}
            />
            <Divider />
          </>
        ))}
      </ScrollView>
    </View>
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
  },
});
