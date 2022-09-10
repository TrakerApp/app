import { useState, useRef, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput, Button, HelperText } from "react-native-paper";
import useColors from "../util/hooks/useColors";

export default function NewTrackingForm({ isEditing, onCreate, onCancel }) {
  const [name, setName] = useState("");
	const [nameHasError, setNameHasError] = useState(false);
  const nameInputRef = useRef(null);
	const colors = useColors()

  const handleCreate = () => {
    if (name !== "") {
			setNameHasError(false)
      onCreate(name);
      setName("");
    } else {
			setNameHasError(true)
		}
  };

  const handleCancel = () => {
    onCancel();
  };

	const handleTextInput = (text) => {
		setName(text)

		if (text !== "") {
			setNameHasError(false)
		}
	}

  useEffect(() => {
    if (isEditing) {
      nameInputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <View style={[styles.rootContainer, { backgroundColor: colors.modalBackground }]}>
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
      <HelperText type="error" visible={nameHasError}>
        Name is required
      </HelperText>
      <View style={styles.buttonsContainer}>
        <Button style={styles.button} mode="outlined" onPress={handleCancel}>
          Cancel
        </Button>
        <Button style={styles.button} mode="outlined" onPress={handleCreate}>
          Create
        </Button>
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
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 20,
  },
});
