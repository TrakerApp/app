import { View, Text, StyleSheet } from "react-native"

export default function Title({ style, children }) {
	return (
		<Text style={[styles.title, style]}>{children}</Text>
	)
}

const styles = StyleSheet.create({
	title: {
		fontSize: 18,
		fontWeight: "bold",
	}
})
