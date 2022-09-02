import { View, Text, StyleSheet } from "react-native"

export default function TrackingListItem({ name, lastOccurrence }) {
	return (
		<View style={styles.rootContainer}>
			<Text style={styles.name}>{name}</Text>
			{lastOccurrence && (<Text style={styles.lastOccurrence}>Last occurence: {lastOccurrence}</Text>)}
		</View>
	)
}

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		alignItems: "flex-start",
		padding: 14,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	name: {
		fontSize: 18,
	},
	lastOccurrence: {
		fontSize: 14,
		color: "#999",
	},
})
