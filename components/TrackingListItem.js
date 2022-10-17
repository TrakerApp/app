import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import useColors from "../util/hooks/useColors";

export default function TrackingListItem({ trackingId, name, lastOccurrenceTime }) {
  const navigation = useNavigation();

  const colors = useColors;
  const lastOccurrenceTimeStr = lastOccurrenceTime ? lastOccurrenceTime : "Never";

	const handlePress = () => {
		navigation.navigate("Tracking", { trackingId })
	}

  return (
    <TouchableRipple onPress={handlePress}>
      <View
        style={[
          styles.rootContainer,
          {
            backgroundColor: colors.normalBackground,
            borderRightColor: colors.normalBorder,
          },
        ]}
      >
        <Text style={styles.name}>{name}</Text>
        {lastOccurrenceTimeStr ? (
          <Text style={styles.lastOccurrence}>
            Last occurrence: {lastOccurrenceTimeStr}
          </Text>
        ) : null}
      </View>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingLeft: 14,
    paddingVertical: 6,
    justifyContent: "center",
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
});
