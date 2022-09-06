import {
  MD3LightTheme as PaperDefaultTheme,
  MD3DarkTheme as PaperDarkTheme,
} from "react-native-paper";

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";

export const DefaultTheme = { paper: PaperDefaultTheme, navigation: NavigationDefaultTheme }
export const DarkTheme = { paper: PaperDarkTheme, navigation: NavigationDarkTheme }
