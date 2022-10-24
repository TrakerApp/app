import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import useColors from "../util/hooks/useColors";
import { localTime } from "../util/localTime";

export default function TrackingListItem({
  trackingId,
  name,
  lastOccurrenceAt,
}) {
  const navigation = useNavigation();

  const colors = useColors;

  const handlePress = () => {
    navigation.navigate("Tracking", { trackingId, name, lastOccurrenceAt });
  };

  return (
    <TouchableRipple onPress={handlePress}>
      <View
        style={[
          styles.rootContainer,
          {
            backgroundColor: colors.normalBackground,
          },
        ]}
      >
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.lastOccurrence}>
          Last occurrence: {localTime(lastOccurrenceAt)}
        </Text>
      </View>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingLeft: 14,
    paddingVertical: 8,
    justifyContent: "center",
    minHeight: 50,
  },
  name: {
    fontSize: 18,
  },
  lastOccurrence: {
    fontSize: 14,
    color: "#999",
  },
});
