import { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Switch } from "react-native-paper";
import { PreferencesContext } from "../../store/context/preferences-context";

export default function DrawerContent() {
  const preferencesContext = useContext(PreferencesContext);

  return (
    <View style={styles.rootContainer}>
      <Text>Dark Theme</Text>
      <Switch
        value={preferencesContext.isThemeDark}
        onValueChange={() => {
          preferencesContext.toggleTheme();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
