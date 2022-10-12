import { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import Title from "../../components/ui/Title";
import { signUp } from "../../util/auth";
import { AuthEmailInput } from "./AuthInputs";
import { useAuthErrorHook } from "./useAuthErrorHook";

export default function SignUpScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [setError, AuthErrorComponent] = useAuthErrorHook()

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" }, // TODO: TK-29
  });

  const handleGoToSignIn = () => {
    navigation.replace("SignIn");
  };

  const handleSignUpPress = async (data) => {
    setLoading(true);
    setError("");

    const res = await signUp(data.email, data.password);

    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-up
      navigation.replace("Confirmation", { userEmail: data.email });
      setError("");
      setLoading(false);
    }
  };

  return (
    <View style={styles.rootContainer}>
      <Title style={styles.title}>Welcome to Tracker</Title>
      <Text style={styles.subtitle}>
        Sign up now and start tracking all your behaviors and habits in a single
        place!
      </Text>
      <View style={styles.formContainer}>
        <AuthEmailInput
          autoFocus={true}
          loading={loading}
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

       <AuthErrorComponent/>

        <Button
          style={styles.outlinedButton}
          mode="outlined"
          disabled={loading}
          onPress={handleSubmit(handleSignUpPress)}
        >
          Sign Up
        </Button>

        <Button
          style={styles.textButton}
          mode="text"
          disabled={loading}
          onPress={handleGoToSignIn}
        >
          Already have an account? Sign in
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingHorizontal: 30,
  },
  title: {
    paddingTop: 80,
  },
  subtitle: {
    paddingTop: 20,
    fontSize: 20,
    textAlign: "center",
  },
  formContainer: {
    paddingTop: 20,
  },
  input: {
    marginTop: 10,
  },
  outlinedButton: {
    marginTop: 20,
  },
  textButton: {
    marginTop: 10,
  },
});
