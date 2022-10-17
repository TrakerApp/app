import { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import {
  currentAuthenticatedUser,
  extractUser,
  signOut,
} from "../../util/auth";

export const AuthContext = createContext({
  isAuthenticated: false,
  isFirstTime: false, // TODO: TK-28; wether it's the first time that the user is using the app
  currentUser: null,
  checkIfUserIsAuthenticated: async () => {},
  signIn: () => {},
  signOut: () => {},
  accessToken: null,
});

export const useAuthContext = () => useContext(AuthContext);

export default function AuthContextProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFirstTime, setIsFirstTime] = useState(false); // TODO: TK-28

  const callSignIn = (user) => {
    setCurrentUser(extractUser(user));
    setAccessToken(user.accessToken)
    setIsAuthenticated(true);
  };

  const callSignOut = () => {
    signOut()
      .then((res) => {
        setCurrentUser(null);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        console.log("ERROR ON SIGN OUT:", err);
      });
  };

  const checkIfUserIsAuthenticated = async ({ bypassCache = false }) => {
    const signedInUser = await currentAuthenticatedUser({ bypassCache });
    if (signedInUser.error === "NotAuthenticated") {
      callSignOut();
    } else {
      // console.log("possible user on sign in:", signedInUser);
      if (signedInUser) {
        callSignIn(signedInUser);
      }
    }
  };

  useEffect(() => {
    checkIfUserIsAuthenticated({ bypassCache: false });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isFirstTime,
        currentUser,
        accessToken,
        signIn: callSignIn,
        signOut: callSignOut,
        checkIfUserIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
