import { StyleSheet, Text, View, ScrollView } from "react-native";
import Title from "../components/Title";
import TrackingListItem from "../components/TrackingListItem";
import TRACKINGS from "../data/trackings";

export default function TrackingsScreen() {
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.helpText}>Swipe left to track</Text>
      <ScrollView style={styles.listContainer}>
        {TRACKINGS.map((tracking) => (
          <TrackingListItem
            key={tracking.id}
            name={tracking.name}
            lastOccurrence={tracking.occurrences?.[0]?.time}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
		width: '100%',
		alignItems: 'center',
		textAlign: 'center',
    paddingTop: 20,
  },
	listContainer: {
		flex: 1,
		width: '100%',
		marginTop: 20,
	},
  title: {
    marginBottom: 10,
  },
  helpText: {
    fontSize: 14,
    color: "#999",
  },
});
