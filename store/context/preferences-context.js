import { createContext, useContext, useState } from "react";

export const PreferencesContext = createContext({
  toggleTheme: () => {},
  isThemeDark: false,
});

export const usePreferencesContext = () => useContext(PreferencesContext);

export default function PreferencesContextProvider({ children }) {
  const [isThemeDark, setIsThemeDark] = useState(false);

  const toggleTheme = () => {
    setIsThemeDark((isDark) => !isDark);
  };

  return (
    <PreferencesContext.Provider value={{ toggleTheme, isThemeDark }}>
      {children}
    </PreferencesContext.Provider>
  );
}
