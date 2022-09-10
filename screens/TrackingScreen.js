import { useLayoutEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import TrackingModel from "../models/tracking";
import useColors from "../util/hooks/useColors";

export default function TrackingScreen({ navigation, route }) {
  const colors = useColors();
  const { id } = route.params;
  const tracking = useMemo(() => {
    return TrackingModel.find(id);
  }, [id]);

  const hasOccurrences = tracking.occurrences?.length > 0;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          size={32}
          icon="chevron-left"
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>{tracking.name}</Text>
      <View style={styles.buttonsContainer}>
        <Button style={styles.button} mode="outlined">
          Edit
        </Button>
        <Button style={styles.button} mode="outlined">
          Track
        </Button>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.info}>Today: 1 time</Text>
        <Text style={styles.info}>This week: 3 times</Text>
      </View>
      <View style={styles.historyContainer}>
        <Text style={styles.subtitle}>History</Text>
        <Text style={[styles.helpText, { color: colors.helpText }]}>
          Swipe left to remove an occurrence
        </Text>
        {hasOccurrences && tracking.occurrences.map((occurrence) => (
          <Text key={occurrence.id} style={styles.occurrence}>{occurrence.time.toString()}</Text>
        ))}
        {!hasOccurrences && (
          <Text style={[styles.helpText, { color: colors.helpText }]}>
            No occurrences yet
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    paddingTop: 20,
    justifyContent: "space-around",
  },
  infoContainer: {
    marginTop: 10,
    paddingLeft: 20,
  },
  historyContainer: {
    marginLeft: 20,
    marginTop: 20,
  },
  info: {
    fontSize: 20,
    marginTop: 10,
  },
  button: {
    paddingHorizontal: 28,
  },
  title: {
    paddingTop: 20,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  helpText: {
    fontSize: 16,
    marginTop: 5,
  },
	occurrence: {
		paddingVertical: 6,
	},
});
