import { createContext, useState } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
	isFirstTime: false, // TODO: TK-28; wether it's the first time that the user is using the app
});

export default function AuthContextProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false); // TODO: TK-28

  return (
    <AuthContext.Provider value={{ isAuthenticated, isFirstTime }}>
      {children}
    </AuthContext.Provider>
  );
}
