import { StatusBar } from "expo-status-bar";
import TrackingsScreen from "./screens/TrackingsScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import DrawerContent from "./components/drawer/Content";
import PreferencesContextProvider, {
  PreferencesContext,
} from "./store/context/preferences-context";
import { useContext } from "react";
import { DefaultTheme, DarkTheme } from "./config/themes";
import TrackingScreen from "./screens/TrackingScreen";

const Drawer = createDrawerNavigator();

function Root() {
  const preferencesContext = useContext(PreferencesContext);
  const theme = preferencesContext.isThemeDark ? DarkTheme : DefaultTheme;

  return (
    <>
      <StatusBar style={preferencesContext.isThemeDark ? "light" : "dark"} />
      <PaperProvider theme={theme.paper}>
        <NavigationContainer theme={theme.navigation}>
          <Drawer.Navigator drawerContent={() => <DrawerContent />}>
            <Drawer.Screen name="Your Trackings" component={TrackingsScreen} />
            <Drawer.Screen name="Tracking" component={TrackingScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </>
  );
}

export default function App() {
  return (
    <>
      <PreferencesContextProvider>
        <Root />
      </PreferencesContextProvider>
    </>
  );
}
