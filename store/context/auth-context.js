import { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { currentAuthenticatedUser, signOut } from "../../util/auth";

export const AuthContext = createContext({
  isAuthenticated: false,
  isFirstTime: false, // TODO: TK-28; wether it's the first time that the user is using the app
  currentUser: null,
  signIn: () => {},
  signOut: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export default function AuthContextProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFirstTime, setIsFirstTime] = useState(false); // TODO: TK-28

  const callSignIn = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const callSignOut = () => {
    signOut()
      .then((res) => {
        setIsAuthenticated(false);
        setCurrentUser(null);
      })
      .catch((err) => {
        console.log("ERROR ON SIGN OUT:", err);
      });
  };

  useEffect(() => {
    const load = async () => {
      const signedInUser = await currentAuthenticatedUser();
      if (signedInUser.error === "NotAuthenticated") {
        callSignOut();
      } else {
        console.log("possible user on sign in:", signedInUser);
        if (signedInUser) {
          callSignIn(signedInUser);
        }
      }
    };
    load();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isFirstTime,
        currentUser,
        signIn: callSignIn,
        signOut: callSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
