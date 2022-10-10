import { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { currentAuthenticatedUser } from "../../util/auth";

export const AuthContext = createContext({
  isAuthenticated: false,
  isFirstTime: false, // TODO: TK-28; wether it's the first time that the user is using the app
  currentUser: null,
  signIn: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export default function AuthContextProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFirstTime, setIsFirstTime] = useState(false); // TODO: TK-28

  const signIn = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
  }

  // useEffect(() => {
  //   console.log(
  //     "Executing useEffect onauthContextProvider for checking user session"
  //   );
  //   const load = async () => {
  //     const signedInUser = await currentAuthenticatedUser();
  //     console.log("possible user on sign in:", signedInUser);
  //     if (signedInUser) {
  //       signIn(signedInUser);
  //     }
  //   };
  //   load();
  // }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isFirstTime, currentUser, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}
