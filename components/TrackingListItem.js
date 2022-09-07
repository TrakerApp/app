import { View, StyleSheet } from "react-native"
import { Text } from "react-native-paper"

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
		paddingLeft: 14,
		paddingBottom: 12,
		justifyContent: 'center',
		minHeight: 50,
		backgroundColor: '#f2f2f2',
		borderRightColor: '#c8c8c8',
		borderRightWidth: 1,
	},
	name: {
		fontSize: 18,
	},
	lastOccurrence: {
		fontSize: 14,
		color: "#999",
	},
})
