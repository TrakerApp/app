import { useContext } from "react"
import { View, StyleSheet } from "react-native"
import { Text } from "react-native-paper"
import { PreferencesContext } from "../store/context/preferences-context"

export default function TrackingListItem({ name, lastOccurrence }) {
	const preferencesContext = useContext(PreferencesContext)
	const backgroundColor = preferencesContext.isThemeDark ? "#010101" : "#f2f2f2"
	const borderRightColor = preferencesContext.isThemeDark ? "#313131" : "#c8c8c8"

	return (
		<View style={[styles.rootContainer, { backgroundColor, borderRightColor }]}>
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
