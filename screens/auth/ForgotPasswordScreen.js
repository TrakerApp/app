import { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import Title from "../../components/ui/Title";
import { forgotPassword } from "../../util/auth";

const errorMessages = {
  UserNotFound: "The email entered does not exist.",
  UserNotConfirmed:
    "The email entered has not been confirmed yet, please check your email and confirm it.",
  CouldNotSendCode: "There was an error sending the code, please try again.",
  ServerError: "There was an error sending the code, please try again.",
};

export default function ForgotPasswordScreen({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  return (
    <View style={styles.rootContainer}>
      <Title style={styles.title}>Forgot Password</Title>
      <Text style={styles.subtitle}>
        We'll send you a code to your email, which then you can use to set a new
        password.
      </Text>
      <View style={styles.formContainer}>
        {isReseting && <> </>}
        {!isReseting && (
          <>
            <TextInput
              name="email"
              disabled={loading}
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={true}
              defaultValue={userEmail}
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

            {error !== "" && (
              <Text style={styles.error}>{errorMessages[error]}</Text>
            )}

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
  error: {
    color: "red",
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
