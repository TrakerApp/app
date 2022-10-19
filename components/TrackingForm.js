import { useState, useRef, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput, Button, HelperText } from "react-native-paper";
import useColors from "../util/hooks/useColors";

const blankForm = { name: "" };

export default function TrackingForm({
  focusInput,
  onSave,
  loading,
  onCancel,
  title,
  error,
  defaultValues = {},
  buttonLabel = "Create",
  showHelp = true,
}) {
  const [form, setForm] = useState({ ...blankForm, ...defaultValues });
  const [nameHasError, setNameHasError] = useState(false);
  const nameInputRef = useRef(null);
  const colors = useColors();

  const handleCreate = async () => {
    if (form.name !== "") {
      setNameHasError(false);
      const { status } = await onSave(form);
      if (status === 201) {
        setForm((currentValues) => {
          return { ...currentValues, ...blankForm };
        });
      }
    } else {
      setNameHasError(true);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleTextInput = (inputId, inputValue) => {
    setForm((currentForm) => {
      return {
        ...currentForm,
        [inputId]: inputValue,
      };
    });

    if (inputValue !== "") {
      setNameHasError(false);
    }
  };

  useEffect(() => {
    if (focusInput) {
      nameInputRef.current.focus();
    }
  }, [focusInput]);

  return (
    <View
      style={[
        styles.rootContainer,
        { backgroundColor: colors.modalBackground },
      ]}
    >
      <Text style={styles.title}>{title}</Text>
      <TextInput
        ref={nameInputRef}
        mode="outlined"
        disabled={loading}
        error={nameHasError}
        label="Name"
        value={form.name}
        placeholder="Drink Water"
        onChangeText={handleTextInput.bind(this, "name")}
      />
      {nameHasError && (
        <HelperText type="error" visible={nameHasError}>
          Name is required
        </HelperText>
      )}
      {!nameHasError && error !== '' && (
        <HelperText type="error">
          {error}
        </HelperText>
      )}
      {showHelp && (
        <HelperText type="info" visible={true}>
          You can change this name later
        </HelperText>
      )}
      <View style={styles.buttonsContainer}>
        <Button style={styles.button} disabled={loading} mode="outlined" onPress={handleCancel}>
          Cancel
        </Button>
        <Button style={styles.button} disabled={loading} mode="outlined" onPress={handleCreate}>
          {buttonLabel}
        </Button>
      </View>
      {showHelp && (
        <View style={styles.examplesContainer}>
          <Text style={[styles.exampleTitle, { color: colors.softText1 }]}>
            Enter the name of the action, event or occurrence that you want to
            track.
          </Text>
          <Text style={[styles.exampleTitle, { color: colors.softText1 }]}>
            Some examples:
          </Text>
          <Text style={[styles.exampleInfo, { color: colors.softText1 }]}>
            Drink water
          </Text>
          <Text style={[styles.exampleInfo, { color: colors.softText1 }]}>
            Stretch
          </Text>
          <Text style={[styles.exampleInfo, { color: colors.softText1 }]}>
            Drink coffee
          </Text>
          <Text style={[styles.exampleInfo, { color: colors.softText1 }]}>
            Wake up
          </Text>
          <Text style={[styles.exampleInfo, { color: colors.softText1 }]}>
            Feeling bored
          </Text>
          <Text style={[styles.exampleInfo, { color: colors.softText1 }]}>
            Called my mom
          </Text>
          <Text style={[styles.exampleInfo, { color: colors.softText1 }]}>
            Drank my pill
          </Text>
        </View>
      )}
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
    textAlign: "center",
  },
  exampleInfo: {
    fontSize: 16,
    textAlign: "center",
  },
});
