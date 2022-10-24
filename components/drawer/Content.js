import { View, StyleSheet, SafeAreaView } from "react-native";
import { Text, Switch, Button } from "react-native-paper";
import { useAuthContext } from "../../store/context/auth-context";
import { usePreferencesContext } from "../../store/context/preferences-context";
import { MaterialIcons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";

export default function DrawerContent() {
  const preferencesContext = usePreferencesContext();
  const authContext = useAuthContext();
  // const navigation = useNavigation();

  // icon = account-circle
  return (
    <SafeAreaView style={styles.rootContainer}>
      <View style={styles.headerContainer}>
        <MaterialIcons name="account-circle" size={128} color={preferencesContext.isThemeDark ? "white" : "black"} />
        <Text style={styles.username}>{authContext.currentUser?.email}</Text>
        <Button mode="text" onPress={authContext.signOut}>
          Sign Out
        </Button>
      </View>
      <View style={styles.themeSwitchContainer}>
        <Text>Dark Theme</Text>
        <Switch
          value={preferencesContext.isThemeDark}
          onValueChange={() => {
            preferencesContext.toggleTheme();
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 20,
    alignItems: "center",
  },
  themeSwitchContainer: {
    paddingTop: 20,
    alignItems: "center",
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
