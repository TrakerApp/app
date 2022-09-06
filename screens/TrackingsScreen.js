import { StyleSheet, SafeAreaView, FlatList } from "react-native";
import { Text, Divider } from "react-native-paper";
import TrackingListItem from "../components/TrackingListItem";
import TRACKINGS from "../data/trackings";

export default function TrackingsScreen() {
  return (
    <SafeAreaView style={styles.rootContainer}>
      <Text style={styles.helpText}>Swipe left to track</Text>
      <FlatList
        style={styles.listContainer}
        data={TRACKINGS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrackingListItem
            name={item.name}
            lastOccurrence={item.occurrences?.[0]?.time}
          />
        )}
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
  },
});
