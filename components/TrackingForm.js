import { useState, useRef, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput, Button, HelperText } from "react-native-paper";
import useColors from "../util/hooks/useColors";

export default function TrackingForm({ isEditing, onSave, onCancel, defaultValues = {} }) {
  const [name, setName] = useState(defaultValues?.name || "");
  const [nameHasError, setNameHasError] = useState(false);
  const nameInputRef = useRef(null);
  const colors = useColors();

  const handleCreate = () => {
    if (name !== "") {
      setNameHasError(false);
      onSave(name);
      setName("");
    } else {
      setNameHasError(true);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleTextInput = (text) => {
    setName(text);

    if (text !== "") {
      setNameHasError(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      nameInputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <View
      style={[
        styles.rootContainer,
        { backgroundColor: colors.modalBackground },
      ]}
    >
      <Text style={styles.title}>Add new tracking</Text>
      <TextInput
        ref={nameInputRef}
        mode="outlined"
        error={nameHasError}
        label="Name"
        value={name}
        placeholder="Drink Water"
        onChangeText={handleTextInput}
      />
      {nameHasError && (
        <HelperText type="error" visible={nameHasError}>
          Name is required
        </HelperText>
      )}
      <HelperText type="info" visible={true}>
        You can change this name later
      </HelperText>
      <View style={styles.buttonsContainer}>
        <Button style={styles.button} mode="outlined" onPress={handleCancel}>
          Cancel
        </Button>
        <Button style={styles.button} mode="outlined" onPress={handleCreate}>
          Create
        </Button>
      </View>
      <View style={styles.examplesContainer}>
        <Text style={[styles.exampleTitle, { color: colors.softText1 }]}>
          Enter the name of the action, event or occurrence that you want to
          track.
        </Text>
        <Text style={[styles.exampleTitle, { color: colors.softText1 }]}>Some examples:</Text>
        <Text style={[styles.exampleInfo, { color: colors.softText1 }]}>Drink water</Text>
        <Text style={[styles.exampleInfo, { color: colors.softText1 }]}>Stretch</Text>
        <Text style={[styles.exampleInfo, { color: colors.softText1 }]}>Drink coffee</Text>
        <Text style={[styles.exampleInfo, { color: colors.softText1 }]}>Wake up</Text>
        <Text style={[styles.exampleInfo, { color: colors.softText1 }]}>Feeling bored</Text>
        <Text style={[styles.exampleInfo, { color: colors.softText1 }]}>Called my mom</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: "100%",
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  examplesContainer: {
    marginTop: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 20,
  },
  exampleTitle: {
    marginBottom: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  exampleInfo: {
    fontSize: 16,
    textAlign: 'center',
  }
});
