import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import Title from "../../components/ui/Title";
import { useAuthContext } from "../../store/context/auth-context";
import { useAuthErrorHook } from "./useAuthErrorHook";
import { AuthEmailInput, AuthCodeInput } from "./AuthInputs";
import {
  confirmSignUp,
  resendConfirmationCode,
  listenToAutoSignIn,
} from "../../util/auth";

export default function ConfirmationScreen({ navigation, route }) {
  const [setError, AuthErrorComponent] = useAuthErrorHook();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const authContext = useAuthContext();
  const userEmail = route?.params?.userEmail || "";

  const {
    register,
    setValue,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: { email: userEmail, code: "" }, // TODO: TK-29
  });

  useEffect(() => {
    console.log("LOADING THE LISTENING HUB");
    listenToAutoSignIn()
      .then((data) => {
        console.log("user from auth received in handleConfirmPress:", data);
        if (data.error === "AutoSignInFailed") {
          // This happens when user creates two accounts and confirms the first one, I think the stored token is from the last one so it can't be confirmed
          navigation.navigate("SignIn", {
            userEmail: getValues("email"),
            successMessage: "Thanks for confirming, please sign in.",
          });
        } else {
          authContext.signIn(data);
        }
      })
      .catch((err) => {
        console.log("error from auth received in handleConfirmPress:", err);
      });
  }, []);

  const handleResendCodePress = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    const email = getValues("email");
    const res = await resendConfirmationCode(email);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccessMessage("Code resent successfully");
      console.log("resending res:", res);
    }
    setLoading(false);
  };

  const handleConfirmPress = async (data) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    const res = await confirmSignUp(data.email, data.code);
    if (res.error) {
      setError(res.error);
    } else {
      // Signed in, wait around 3 seconds for the listenToAutoSignIn callback, which if doesn't happens, we should redirect user to signIn if not signed in
      setTimeout(async () => {
        if (authContext.isAuthenticated) {
          return;
        }

        await authContext.checkIfUserIsAuthenticated({ bypassCache: true });

        if (!authContext.isAuthenticated) {
          navigation.navigate("SignIn", {
            userEmail: getValues("email"),
            successMessage: "Thanks for confirming, please sign in.",
          });
        }
      }, 3_000);
    }
    console.log("confirmation res:", res);
    setLoading(false);
  };

  const handleSignInPress = () => {
    navigation.navigate("SignIn", { userEmail: getValues("email") });
  };

  return (
    <View style={styles.rootContainer}>
      <Title style={styles.title}>Confirm</Title>
      <Text style={styles.subtitle}>
        You should have received a 6 digit code in your email, please enter it
        below.
      </Text>
      <View style={styles.formContainer}>
        <AuthEmailInput
          loading={loading}
          defaultValue={userEmail}
          error={errors.email}
          style={styles.input}
          setValue={setValue}
          register={register}
        />

        <AuthCodeInput
          autoFocus={true}
          label="Verification Code"
          loading={loading}
          error={errors.code}
          style={styles.input}
          setValue={setValue}
          register={register}
        />

        <AuthErrorComponent />

        {successMessage !== "" && (
          <Text style={styles.success}>{successMessage}</Text>
        )}

        <Button
          mode="outlined"
          disabled={loading}
          style={styles.outlinedButton}
          onPress={handleSubmit(handleConfirmPress)}
        >
          Confirm
        </Button>
        <View style={styles.linksContainer}>
          <Button
            mode="text"
            onPress={handleResendCodePress}
            disabled={loading}
          >
            You haven't received the code? Resend
          </Button>
          <Button mode="text" onPress={handleSignInPress} disabled={loading}>
            Already confirmed? Sign in
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingHorizontal: 30,
  },
  formContainer: {
    paddingTop: 20,
  },
  linksContainer: {
    paddingTop: 20,
  },
  title: {
    paddingTop: 80,
  },
  subtitle: {
    paddingTop: 20,
    fontSize: 20,
    textAlign: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
    paddingTop: 10,
  },
  success: {
    color: "green",
    textAlign: "center",
    paddingTop: 10,
  },
  input: {
    marginTop: 10,
  },
  outlinedButton: {
    marginTop: 20,
  },
});
