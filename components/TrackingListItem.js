import { View, StyleSheet } from "react-native"
import { Text } from "react-native-paper"
import useColors from "../util/hooks/useColors"

export default function TrackingListItem({ name, lastOccurrenceTime }) {
	const colors = useColors
	const lastOccurrenceTimeStr = lastOccurrenceTime ? lastOccurrenceTime.toLocaleString() : "Never"

	return (
		<View style={[styles.rootContainer, { backgroundColor: colors.normalBackground, borderRightColor: colors.normalBorder }]}>
			<Text style={styles.name}>{name}</Text>
			{lastOccurrenceTimeStr ? (<Text style={styles.lastOccurrence}>Last occurrence: {lastOccurrenceTimeStr}</Text>) : null}
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
