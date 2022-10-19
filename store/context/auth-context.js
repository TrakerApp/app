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
  accessToken: () => {},
  considerTokenExpired: () => {},
  getValidAccessToken: async () => {},
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
    // we reduce 1 second from access token exp, because we want to know if it'll be expired in advance for fetching a new token
    const exp = new Date((currentUser.accessTokenExp - 1) * 1000);
    const now = new Date();
    console.log("expiration date vs now:", exp, now)
    return now > exp;
  };

  // always when needing an access token, this method should be called
  const getValidAccessToken = () => {
    return new Promise(async (resolve, reject) => {
      if (considerTokenExpired()) {
        const data = await currentSession();

        if (data.error) {
          callSignOut();
          resolve(null);
        } else {
          setCurrentUser((current) => ({
            ...current,
            accessToken: data.accessToken.jwtToken,
            accessTokenExp: data.accessToken.payload.exp,
          }));
          resolve(data.accessToken.jwtToken);
        }
      } else {
        resolve(currentUser.accessToken);
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
        getValidAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
