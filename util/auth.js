// https://docs.amplify.aws/lib/auth/getting-started/q/platform/js/#configure-your-application
// https://docs.amplify.aws/lib/auth/start/q/platform/js/#create-new-authentication-resource
import { Amplify, Auth } from "aws-amplify";
import { COGNITO_POOL_ID, COGNITO_CLIENT_ID } from "@env";

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

export const signUp = async (email, password) => {
  try {
    const response = await Auth.signUp({
      username: email,
      password,
      attributes: {
        email, // optional
        // phone_number, // optional - E.164 number convention
        // other custom attributes
      },
      autoSignIn: {
        // optional - enables auto sign in after user is confirmed
        enabled: true,
      },
    });
    // RESPONSE: {"user":{"username":"carlosr706+1@gmail.com","pool":{"userPoolId":"us-east-1_W0a2h5L0s","clientId":"3c689eqc0nhl7cansolh5bnr7o","client":{"endpoint":"https://cognito-idp.us-east-1.amazonaws.com/","fetchOptions":{}},"advancedSecurityDataCollectionFlag":true},"Session":null,"client":{"endpoint":"https://cognito-idp.us-east-1.amazonaws.com/","fetchOptions":{}},"signInUserSession":null,"authenticationFlowType":"USER_SRP_AUTH","keyPrefix":"CognitoIdentityServiceProvider.3c689eqc0nhl7cansolh5bnr7o","userDataKey":"CognitoIdentityServiceProvider.3c689eqc0nhl7cansolh5bnr7o.carlosr706+1@gmail.com.userData"},"userConfirmed":false,"userSub":"d81bdc27-0153-4131-914b-438ca6a66af9","codeDeliveryDetails":{"AttributeName":"email","DeliveryMedium":"EMAIL","Destination":"c***@g***"}}
    return response;
  } catch (error) {
    console.log("error signing up:", error);
    throw error;
  }
};

export const confirmSignUp = async (email, code) => {
  try {
    const response = await Auth.confirmSignUp(email, code);
    // response: SUCCESS
    // TODO: https://stackoverflow.com/questions/49000676/aws-cognito-authentication-user-password-auth-flow-not-enabled-for-this-client
    return response;
  } catch (error) {
    console.log("error confirming sign up:", error);
    throw error;
  }
};

export const resendConfirmationCode = async (email) => {
  try {
    const res = await Auth.resendSignUp(email);
    console.log("code resent successfully");
    return res
  } catch (err) {
    console.log("error resending code: ", err);
  }
};

export const signIn = async (email, password) => {
  try {
    // TODO: error USER_PASSWORD_AUTH flow not enabled for this client
    const user = await Auth.signIn(email, password);
    console.log("on signin user:", user);
    return user;
  } catch (error) {
    console.log("error signing in", error);
  }
};

export const signOut = async () => {
  try {
    await Auth.signOut();
  } catch (error) {
    console.log("error signing out: ", error);
  }
};

export const globalSignOut = async () => {
  try {
      await Auth.signOut({ global: true });
  } catch (error) {
      console.log('error signing out: ', error);
  }
}
