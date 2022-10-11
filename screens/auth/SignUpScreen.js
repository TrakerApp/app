import { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import Title from "../../components/ui/Title";
import { signUp } from "../../util/auth";

const errorMessages = {
  UserAlreadyExists: "The email you entered already exists.",
  ServerError: "There was an error signing in, please try again.",
};

export default function SignUpScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        <TextInput
          name="email"
          disabled={loading}
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={true}
          keyboardType="email-address"
          textContentType="emailAddress"
          mode="outlined"
          error={errors.email}
          label="Email"
          placeholder="john@gmail.com"
          style={styles.input}
          onChangeText={(text) => setValue("email", text)}
          {...register("email", {
            required: true,
            validate: {
              requiredInput: (value) => value.trim() !== "",
            },
          })}
        />
        <TextInput
          name="password"
          disabled={loading}
          secureTextEntry={true}
          textContentType="password"
          mode="outlined"
          error={errors.password}
          label="Password"
          style={styles.input}
          onChangeText={(text) => setValue("password", text)}
          {...register("password", {
            required: true,
            validate: {
              requiredInput: (value) => value.trim() !== "",
            },
          })}
        />

        {error !== "" && (
          <Text style={styles.error}>{errorMessages[error]}</Text>
        )}

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
  error: {
    color: "red",
    textAlign: "center",
    paddingTop: 10,
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
