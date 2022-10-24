import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PreferencesContext = createContext({
  toggleTheme: () => {},
  isThemeDark: false,
});

export const usePreferencesContext = () => useContext(PreferencesContext);

export default function PreferencesContextProvider({ children }) {
  const [isThemeDark, setIsThemeDark] = useState(false);

  const loadPreferences = async () => {
    const theme = await AsyncStorage.getItem('theme');

    if (theme) {
      setIsThemeDark(theme === 'dark');
    }
  };

  const storePreferences = ({ theme }) => {
    console.log("storing prefs! theme:", theme)
    AsyncStorage.setItem('theme', theme);
  }

  useEffect(() => {
    loadPreferences();
  }, [])

  const toggleTheme = () => {
    const currentThemeIsDark = isThemeDark
    storePreferences({ theme: !currentThemeIsDark ? 'dark' : 'light' });
    setIsThemeDark(!currentThemeIsDark);
  };

  return (
    <PreferencesContext.Provider value={{ toggleTheme, isThemeDark }}>
      {children}
    </PreferencesContext.Provider>
  );
}
