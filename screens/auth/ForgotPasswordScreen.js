import { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import Title from "../../components/ui/Title";
import { forgotPassword, forgotPasswordSubmit } from "../../util/auth";
import { AuthCodeInput, AuthEmailInput, AuthPasswordInput } from "./AuthInputs";
import { useAuthErrorHook } from "./useAuthErrorHook";

export default function ForgotPasswordScreen({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [setError, AuthErrorComponent] = useAuthErrorHook();
  const [successMessage, setSuccessMessage] = useState("");
  const [isReseting, setIsReseting] = useState(false);
  const userEmail = route?.params?.userEmail || "";

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: userEmail, code: "", password: "" }, // TODO: TK-29
  });

  const handleGoToSignIn = () => {
    navigation.navigate("SignIn");
  };

  const handleGoToConfirmation = () => {
    navigation.replace("Confirmation", { userEmail: getValues("email") });
  };

  const handleForgotPasswordPress = async ({ email }) => {
    setLoading(true);
    setError("");
    setIsReseting(false);
    const res = await forgotPassword(email);
    console.log("res from forgotPassword:", res);
    if (res.error) {
      setError(res.error);
    } else {
      setIsReseting(true);
      // show the code and new password fields
    }
    setLoading(false);
  };

  const handleSetNewPasswordPress = async ({ email, code, password }) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    const res = await forgotPasswordSubmit(email, code, password);
    console.log("res from forgotPassword:", res);
    if (res.error) {
      setError(res.error);
    } else {
      navigation.replace("SignIn", {
        userEmail: email,
        successMessage: "Password reset successfully, you can log in now",
      });
    }
    setLoading(false);
  };

  const handleResendResetPasswordCodePress = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    const res = await forgotPassword(getValues("email"));
    if (res.error) {
      setError(res.error);
    } else {
      setSuccessMessage("Code resent successfully");
      console.log("resending res:", res);
    }
    setLoading(false);
  };

  return (
    <View style={styles.rootContainer}>
      <Title style={styles.title}>Forgot Password</Title>
      <Text style={styles.subtitle}>
        We'll send you a code to your email, which then you can use to set a new
        password.
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

        {isReseting && (
          <>
            <Text style={styles.codeHint}>
              You should have received a code in your email, please check, input
              the code below and set your new password.
            </Text>
            <AuthCodeInput
              label="Password Reset Code"
              loading={loading}
              error={errors.code}
              style={styles.input}
              setValue={setValue}
              register={register}
            />
            <AuthPasswordInput
              label="New Password"
              loading={loading}
              error={errors.password}
              style={styles.input}
              setValue={setValue}
              register={register}
            />

            <AuthErrorComponent />

            <Button
              mode="outlined"
              disabled={loading}
              style={styles.outlinedButton}
              onPress={handleSubmit(handleSetNewPasswordPress)}
            >
              Set new password
            </Button>

            {successMessage !== "" && (
              <Text style={styles.success}>{successMessage}</Text>
            )}

            <View style={styles.linksContainer}>
              <Button
                mode="text"
                onPress={handleResendResetPasswordCodePress}
                disabled={loading}
              >
                Didn't receive the code? Resend it
              </Button>
            </View>
          </>
        )}
        {!isReseting && (
          <>
            <AuthErrorComponent />

            <Button
              mode="outlined"
              disabled={loading}
              style={styles.outlinedButton}
              onPress={handleSubmit(handleForgotPasswordPress)}
            >
              Send password code
            </Button>
            <View style={styles.linksContainer}>
              <Button
                mode="text"
                onPress={handleGoToConfirmation}
                disabled={loading}
              >
                Account not confirmed? Confirm it
              </Button>
              <Button mode="text" onPress={handleGoToSignIn} disabled={loading}>
                Already have an account? Sign in
              </Button>
            </View>
          </>
        )}
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
  success: {
    color: "green",
    textAlign: "center",
    paddingTop: 10,
  },
  codeHint: {
    paddingTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
  input: {
    marginTop: 10,
  },
  outlinedButton: {
    marginTop: 20,
  },
});
