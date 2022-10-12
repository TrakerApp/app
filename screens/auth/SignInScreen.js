import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import Title from "../../components/ui/Title";
import { useAuthContext } from "../../store/context/auth-context";
import { signIn } from "../../util/auth";

export default function SignInScreen({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [setError, AuthErrorComponent] = useAuthErrorHook();
  const [successMessage, setSuccessMessage] = useState("");
  const authContext = useAuthContext();
  const userEmail = route?.params?.userEmail || "";

  useEffect(() => {
    if (route?.params?.successMessage) {
      setSuccessMessage(route.params.successMessage);
    }
  }, [route?.params?.successMessage]);

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: userEmail, password: "" }, // TODO: TK-29
  });

  const handleGoToSignUp = () => {
    setSuccessMessage("");
    navigation.navigate("SignUp");
  };

  const handleGoToForgotPassword = () => {
    setSuccessMessage("");
    navigation.replace("ForgotPassword", { userEmail: getValues("email") });
  };

  const handleGoToConfirmation = () => {
    setSuccessMessage("");
    navigation.replace("Confirmation", { userEmail: getValues("email") });
  };

  const handleSignInPress = async (data) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const user = await signIn(data.email, data.password);

    if (user.error) {
      setError(user.error);
      setLoading(false);
    } else {
      // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-in
      setError("");
      setLoading(false);
      authContext.signIn(user);
    }
  };

  return (
    <View style={styles.rootContainer}>
      <Title style={styles.title}>Sign In</Title>
      <Text style={styles.subtitle}>Welcome back!</Text>
      <View style={styles.formContainer}>
        <AuthEmailInput
          autoFocus={true}
          loading={loading}
          defaultValue={userEmail}
          error={errors.email}
          style={styles.input}
          setValue={setValue}
          register={register}
        />

        <AuthPasswordInput
          label="Password"
          loading={loading}
          error={errors.password}
          style={styles.input}
          setValue={setValue}
          register={register}
        />

        <AuthErrorComponent />
        {successMessage !== "" && (
          <Text style={styles.success}>{successMessage}</Text>
        )}

        <Button
          style={styles.outlinedButton}
          mode="outlined"
          disabled={loading}
          onPress={handleSubmit(handleSignInPress)}
        >
          Sign In
        </Button>
        <View style={styles.linksContainer}>
          <Button mode="text" onPress={handleGoToSignUp} disabled={loading}>
            New to Traker? Sign up now!
          </Button>
          <Button
            mode="text"
            onPress={handleGoToForgotPassword}
            disabled={loading}
          >
            Password lost? Recover it
          </Button>
          <Button
            mode="text"
            onPress={handleGoToConfirmation}
            disabled={loading}
          >
            Account not confirmed? Confirm it
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
