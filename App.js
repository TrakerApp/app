import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import TrackingsScreen from "./screens/TrackingsScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from "react-native-paper";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import merge from "deepmerge";
import DrawerContent from "./components/drawer/Content";
import PreferencesContextProvider, {
  PreferencesContext,
} from "./store/context/preferences-context";
import { useContext } from "react";

const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

const Drawer = createDrawerNavigator();

function Root() {
  const preferencesContext = useContext(PreferencesContext);
  const theme = preferencesContext.isThemeDark
    ? CombinedDarkTheme
    : CombinedDefaultTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <Drawer.Navigator drawerContent={() => <DrawerContent />}>
          <Drawer.Screen name="Your Trackings" component={TrackingsScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <PreferencesContextProvider>
        <Root />
      </PreferencesContextProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
