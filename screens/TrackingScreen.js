import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, IconButton, Text, Portal, Modal } from "react-native-paper";
import { TrackingsContext } from "../store/context/trackings-context";
import useColors from "../util/hooks/useColors";
import TrackingForm from "../components/TrackingForm";

const getPluralSingular = (count, singular, plural) => {
  const text = count === 1 ? singular : plural;
  return `${count} ${text}`;
};

export default function TrackingScreen({ navigation, route }) {
  const trackingsCtx = useContext(TrackingsContext);
  const [tracking, setTracking] = useState(null);
  const [occurrences, setOccurrences] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const colors = useColors();
  const { trackingId } = route.params;

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

  useEffect(() => {
    const fetchTracking = async () => {
      const { status, data } = await trackingsCtx.findTracking(trackingId);
      if (status === 200) {
        setTracking(data);
      }
    };

    const fetchOccurrences = async () => {
      const { status, data } = await trackingsCtx.listOccurrences({
        trackingId,
        page: 1,
        perPage: 10,
      });
      if (status === 200) {
        console.log("OCCURRENCES DATA: data", data);
        setOccurrences(data.occurrences);
      } else {
        console.log("error on fetch occurrences:", status, data)
      }
    }

    fetchTracking();
    fetchOccurrences();
  }, [trackingId]);

  if (!tracking) {
    return <Text>Loading...</Text>;
  }

  const handleTrack = async () => {
    const { status, data } = await trackingsCtx.track({
      trackingId: trackingId,
    });
    console.log("status, data is", status, data);
    if (status === 201) {
      setTracking({
        ...tracking,
        todayOccurrences: tracking.todayOccurrences + 1,
        weekOccurrences: tracking.weekOccurrences + 1,
      });

      // NOTE: WE WILL CHANGE lastOccurrenceAt -> createdAt
      setOccurrences((prevOccurrences) => [{ occurrenceId: data.occurrenceId, createdAt: data.lastOccurrenceAt }, ...prevOccurrences]);
    }
  };

  const showModal = () => setEditModalVisible(true);
  const hideModal = () => setEditModalVisible(false);

  const handleSaveName = ({ name }) => {
    trackingsCtx.editTracking({ trackingId, name });
    hideModal();
  };

  const hasOccurrences = occurrences.length > 0;

  return (
    <View style={styles.rootContainer}>
      <Portal>
        <Modal visible={editModalVisible} onDismiss={hideModal}>
          <TrackingForm
            defaultValues={{ name: tracking.name }}
            focusInput={editModalVisible}
            onSave={handleSaveName}
            onCancel={hideModal}
            showHelp={false}
            buttonLabel="Save"
          />
        </Modal>
      </Portal>

      <Text style={styles.title}>{tracking.name}</Text>
      <View style={styles.buttonsContainer}>
        <Button style={styles.button} mode="outlined" onPress={showModal}>
          Edit
        </Button>
        <Button style={styles.button} mode="outlined" onPress={handleTrack}>
          Track
        </Button>
      </View>
      <View style={styles.infoContainer}>
        <View>
          <Text style={[styles.infoTitle, styles.info]}>Today</Text>
          <Text style={styles.info}>
            {getPluralSingular(tracking.todayOccurrences, "time", "times")}
          </Text>
        </View>
        <View>
          <Text style={[styles.infoTitle, styles.info]}>This week</Text>
          <Text style={styles.info}>
            {getPluralSingular(tracking.weekOccurrences, "time", "times")}
          </Text>
        </View>
      </View>
      <View style={styles.historyContainer}>
        <Text style={styles.subtitle}>History</Text>
        <Text style={[styles.helpText, { color: colors.helpText }]}>
          Swipe left to remove an occurrence
        </Text>
        {hasOccurrences &&
          occurrences.map((occurrence) => (
            <Text key={occurrence.occurrenceId} style={styles.occurrence}>
              {occurrence.createdAt.toString()}
            </Text>
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
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  historyContainer: {
    marginLeft: 20,
    marginTop: 20,
  },
  infoTitle: {
    fontWeight: "bold",
  },
  info: {
    fontSize: 20,
    marginTop: 10,
    textAlign: "center",
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
