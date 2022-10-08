import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import PreferencesContextProvider, {
  PreferencesContext,
} from "./store/context/preferences-context";
import { useContext } from "react";
import { DefaultTheme, DarkTheme } from "./config/themes";
import TrackingsContextProvider from "./store/context/trackings-context";
import AuthContextProvider, { AuthContext } from "./store/context/auth-context";
import AuthenticatedNavigator from "./navigation/AuthenticatedNavigator";
import UnauthenticatedNavigator from "./navigation/UnauthenticatedNavigator";

function Root() {
  const preferencesContext = useContext(PreferencesContext);
  const authContext = useContext(AuthContext);
  const theme = preferencesContext.isThemeDark ? DarkTheme : DefaultTheme;

  return (
    <>
      <StatusBar style={preferencesContext.isThemeDark ? "light" : "dark"} />
      <PaperProvider theme={theme.paper}>
        <NavigationContainer theme={theme.navigation}>
          {authContext.isAuthenticated ? (
            <AuthenticatedNavigator />
          ) : (
            <UnauthenticatedNavigator />
          )}
        </NavigationContainer>
      </PaperProvider>
    </>
  );
}

export default function App() {
  return (
    <>
      <AuthContextProvider>
        <PreferencesContextProvider>
          <TrackingsContextProvider>
            <Root />
          </TrackingsContextProvider>
        </PreferencesContextProvider>
      </AuthContextProvider>
    </>
  );
}
