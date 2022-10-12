// custom hook for errors

import { StyleSheet } from "react-native";

const errorMessages = {
  InvalidCode: "The code entered is invalid.",
  UserNotFound: "The email introduced was not found.",
  CouldNotConfirm:
    "There was an error confirming your account, please try again.",
  UserAlreadyConfirmed: "The account is already confirmed.",
  CouldNotResendCode:
    "There was an error resending the code, please try again.",
  UserNotConfirmed:
    "The email entered has not been confirmed yet, please check your email and confirm it.",
  CouldNotSendCode: "There was an error sending the code, please try again.",
  PasswordNotLongEnough: "Password length must be at least 6 characters.",
  ExpiredCode: "The code introduced is expired, request a new one.",
  LimitExceeded: "You are requesting too many codes, please try again later.",
  CouldNotSetNewPassword: "There was an error setting the new password.",
  ServerError: "There was an error, please try again.",
  UserAlreadyExists: "The email you entered already exists.",
  UserDoesNotExist: "Email or password is incorrect.",
  IncorrectCredentials: "Email or password is incorrect.",
};

const AuthErrorText = (error) => {
  return (
    <>
      {error !== "" && <Text style={styles.error}>{errorMessages[error]}</Text>}
    </>
  );
};

export const useAuthErrorHook = () => {
  const [error, setError] = useState(null);

  return [setError, AuthErrorText(error)];
};

const styles = StyleSheet.create({
  error: {
    color: "red",
    textAlign: "center",
    paddingTop: 10,
  },
});
