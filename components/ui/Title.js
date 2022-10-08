import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export default function Title({ children, style = {} }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    paddingTop: 20,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
});
