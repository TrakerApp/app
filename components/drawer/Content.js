import { View, StyleSheet } from "react-native";
import { Text, Switch, Button } from "react-native-paper";
import { useAuthContext } from "../../store/context/auth-context";
import { usePreferencesContext } from "../../store/context/preferences-context";

export default function DrawerContent() {
  const preferencesContext = usePreferencesContext();
  const authContext = useAuthContext();

  return (
    <View style={styles.rootContainer}>
      <Text>Dark Theme</Text>
      <Switch
        value={preferencesContext.isThemeDark}
        onValueChange={() => {
          preferencesContext.toggleTheme();
        }}
      />

      <Button mode="text" onPress={authContext.signOut}>
        Sign Out ({authContext.currentUser?.email})
      </Button>
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
