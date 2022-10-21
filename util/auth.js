// https://docs.amplify.aws/lib/auth/getting-started/q/platform/js/#configure-your-application
// https://docs.amplify.aws/lib/auth/start/q/platform/js/#create-new-authentication-resource
import { Amplify, Auth, Hub } from "aws-amplify";
import { COGNITO_POOL_ID, COGNITO_CLIENT_ID } from "@env";
import { getAuthErrorMessage } from "./authErrors";
import { decode } from "base-64";

Amplify.configure({
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    // identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',

    // REQUIRED - Amazon Cognito Region
    region: "us-east-1",

    // OPTIONAL - Amazon Cognito Federated Identity Pool Region
    // Required only if it's different from Amazon Cognito Region
    // identityPoolRegion: 'XX-XXXX-X',

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: COGNITO_POOL_ID,

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: COGNITO_CLIENT_ID,

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false,

    // OPTIONAL - This is used when autoSignIn is enabled for Auth.signUp
    // 'code' is used for Auth.confirmSignUp, 'link' is used for email link verification
    signUpVerificationMethod: "code", // 'code' | 'link'

    // OPTIONAL - Configuration for cookie storage
    // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
    // cookieStorage: {
    // REQUIRED - Cookie domain (only required if cookieStorage is provided)
    // domain: '.yourdomain.com',
    // OPTIONAL - Cookie path
    // path: '/',
    // OPTIONAL - Cookie expiration in days
    // expires: 365,
    // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
    // sameSite: "strict" | "lax",
    // OPTIONAL - Cookie secure flag
    // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
    // secure: true
    // },

    // OPTIONAL - customized storage object
    // storage: MyStorage,

    // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: "USER_PASSWORD_AUTH",

    // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
    // clientMetadata: { myCustomKey: 'myCustomValue' },

    // OPTIONAL - Hosted UI configuration
    // oauth: {
    // 		domain: 'your_cognito_domain',
    // 		scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
    // 		redirectSignIn: 'http://localhost:3000/',
    // 		redirectSignOut: 'http://localhost:3000/',
    // 		responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
    // }
    // /
  },
});

export const getJwtData = (jwt) => {
  const base64Url = jwt.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    decode(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
};

export const extractUser = (data) => {
  // "data" is an object that is returned by Auth, it has it's own methods, it's not a simple object
  if (data.email && data.sub && data.accessToken) {
    return data;
  }

  const { exp } = getJwtData(data.signInUserSession.accessToken.jwtToken);

  return {
    email: data.attributes.email,
    sub: data.attributes.sub,
    accessToken: data.signInUserSession.accessToken.jwtToken,
    accessTokenExp: exp,
  };
};

export const signUp = async (email, password) => {
  try {
    return await Auth.signUp({
      username: email.toLowerCase(),
      password,
      attributes: {
        email: email.toLowerCase(), // optional
        // phone_number, // optional - E.164 number convention
        // other custom attributes
        "custom:plan_name": "beta",
      },
      autoSignIn: {
        // optional - enables auto sign in after user is confirmed
        enabled: true,
      },
    });
    // RESPONSE: {"user":{"username":"carlosr706+1@gmail.com","pool":{"userPoolId":"us-east-1_W0a2h5L0s","clientId":"3c689eqc0nhl7cansolh5bnr7o","client":{"endpoint":"https://cognito-idp.us-east-1.amazonaws.com/","fetchOptions":{}},"advancedSecurityDataCollectionFlag":true},"Session":null,"client":{"endpoint":"https://cognito-idp.us-east-1.amazonaws.com/","fetchOptions":{}},"signInUserSession":null,"authenticationFlowType":"USER_SRP_AUTH","keyPrefix":"CognitoIdentityServiceProvider.3c689eqc0nhl7cansolh5bnr7o","userDataKey":"CognitoIdentityServiceProvider.3c689eqc0nhl7cansolh5bnr7o.carlosr706+1@gmail.com.userData"},"userConfirmed":false,"userSub":"d81bdc27-0153-4131-914b-438ca6a66af9","codeDeliveryDetails":{"AttributeName":"email","DeliveryMedium":"EMAIL","Destination":"c***@g***"}}
  } catch (error) {
    console.log("error signing up:", error);
    // throw error;
    return {
      error: getAuthErrorMessage(error),
    };
  }
};

export const confirmSignUp = async (email, code) => {
  try {
    return await Auth.confirmSignUp(email, code);
  } catch (error) {
    console.log("error confirming sign up:", error);

    return { error: getAuthErrorMessage(error, "CouldNotConfirm") };
  }
};

export const currentSession = () => {
  return new Promise((resolve, reject) => {
    Auth.currentSession()
      .then((data) => {
        console.log("got data from currentSession:", data)
        resolve(data);
      })
      .catch((error) => {
        console.log("error on auth getting currentSession:", error);
        resolve({ error: getAuthErrorMessage(error, "CouldNotFetchSession") });
      });
  });
};

export const resendConfirmationCode = async (email) => {
  try {
    return await Auth.resendSignUp(email);
  } catch (error) {
    console.log("error resending code: ", error);

    return { error: getAuthErrorMessage(error, "CouldNotResendCode") };
  }
};

export const signIn = async (email, password) => {
  try {
    const user = await Auth.signIn(email, password);

    return extractUser(user);
  } catch (error) {
    console.log("error signing in", error);

    return { error: getAuthErrorMessage(error) };
  }
};

export const signOut = async () => {
  try {
    return await Auth.signOut();
  } catch (error) {
    console.log("error signing out: ", error);
    return { error: getAuthErrorMessage(error) };
  }
};

export const globalSignOut = async () => {
  try {
    return await Auth.signOut({ global: true });
  } catch (error) {
    console.log("error signing out globally: ", error);
    return { error: getAuthErrorMessage(error) };
  }
};

export const listenToAutoSignIn = () => {
  return new Promise((resolve, reject) => {
    try {
      Hub.listen("auth", ({ payload }) => {
        const { event } = payload;
        if (event === "autoSignIn") {
          resolve(extractUser(payload.data));
        } else if (event === "autoSignIn_failure") {
          console.log("auto sign in failed!payload.data:", payload.data);
          resolve({
            error: getAuthErrorMessage(
              payload.data?.toString(),
              "AutoSignInFailed"
            ),
          });
        }
      });
    } catch (error) {
      console.log("ERROR IN THE HUB.LISTEN CODE!  error:", error);
      resolve({ error: getAuthErrorMessage(error, "AutoSignInFailed") });
    }
  });
};

export const currentAuthenticatedUser = ({ bypassCache = false }) => {
  return new Promise((resolve, reject) => {
    try {
      Auth.currentAuthenticatedUser({
        bypassCache: bypassCache, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
      })
        .then((data) => {
          resolve(extractUser(data));
        })
        .catch((error) => {
          console.log("error getting current authenticated user:", error);

          resolve({ error: getAuthErrorMessage(error, "NotAuthenticated") });
        });
    } catch (error) {
      console.log("error getting current user: ", error);

      resolve({ error: getAuthErrorMessage(error, "NotAuthenticated") });
    }
  });
};

export const forgotPassword = (email) => {
  return new Promise((resolve, reject) => {
    try {
      Auth.forgotPassword(email)
        .then((data) => resolve(data))
        .catch((error) => {
          console.log("ERROR on forgotPassword .catch:", error);

          resolve({ error: getAuthErrorMessage(error, "CouldNotSendCode") });
        });
    } catch (error) {
      console.log("error sending forgot password code: ", error);

      resolve({ error: getAuthErrorMessage(error, "CouldNotSendCode") });
    }
  });
};

export const forgotPasswordSubmit = (email, code, newPassword) => {
  return new Promise((resolve, reject) => {
    try {
      Auth.forgotPasswordSubmit(email, code, newPassword)
        .then((data) => resolve(data))
        .catch((error) => {
          console.log("ERROR on forgotPassword .catch:", error);

          resolve({
            error: getAuthErrorMessage(error, "CouldNotSetNewPassword"),
          });
        });
    } catch (error) {
      console.log(
        "error sending setting new password on forgot password: ",
        error
      );
      resolve({ error: getAuthErrorMessage(error, "ServerError") });
    }
  });
};
