import { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import {
  currentAuthenticatedUser,
  extractUser,
  signOut,
  currentSession,
} from "../../util/auth";

export const AuthContext = createContext({
  isAuthenticated: false,
  isFirstTime: false, // TODO: TK-28; wether it's the first time that the user is using the app
  currentUser: null,
  checkIfUserIsAuthenticated: async () => {},
  signIn: () => {},
  signOut: () => {},
  considerTokenExpired: () => {},
  getValidIdToken: async () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export default function AuthContextProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFirstTime, setIsFirstTime] = useState(false); // TODO: TK-28

  const callSignIn = (user) => {
    setCurrentUser(extractUser(user));
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

  const considerTokenExpired = () => {
    const exp = new Date(currentUser.idTokenExp * 1000);
    const now = new Date();

    return now > exp;
  };

  // always when needing an id token, this method should be called
  const getValidIdToken = () => {
    return new Promise(async (resolve, reject) => {
      if (considerTokenExpired()) {
        const data = await currentSession();

        if (data.error) {
          callSignOut();
          resolve(null);
        } else {
          setCurrentUser((current) => ({
            ...current,
            idToken: data.idToken.jwtToken,
            idTokenExp: data.idToken.payload.exp,
          }));
          resolve(data.idToken.jwtToken);
        }
      } else {
        resolve(currentUser.idToken);
      }
    });
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
        signIn: callSignIn,
        signOut: callSignOut,
        checkIfUserIsAuthenticated,
        considerTokenExpired,
        getValidIdToken: getValidIdToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
