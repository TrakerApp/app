import { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View, Linking } from "react-native";
import { Button, Text } from "react-native-paper";
import Title from "../../components/ui/Title";
import { signUp } from "../../util/auth";
import { AuthEmailInput, AuthPasswordInput } from "./AuthInputs";
import { useAuthErrorHook } from "./useAuthErrorHook";
import { Checkbox } from "react-native-paper";
import useColors from "../../util/hooks/useColors";

const EULA_URL = "https://traker-public-terms.s3.amazonaws.com/EULA.pdf";
const PRIVACY_POLICY_URL = "https://traker-public-terms.s3.amazonaws.com/Privacy.pdf";

export default function SignUpScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [setError, AuthErrorComponent] = useAuthErrorHook();
  const [checked, setChecked] = useState(false);
  const colors = useColors();

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

    if (!checked) {
      setError("MustAcceptTos");
      setLoading(false);
      return
    }

    const res = await signUp(data.email, data.password, checked);

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

        <View style={styles.checkboxContainer}>
          <Checkbox.Android
            status={checked ? "checked" : "unchecked"}
            color={colors.softText1}
            uncheckedColor={colors.softText1}
            onPress={() => {
              setChecked(!checked);
            }}
          />
          <Text style={[styles.checkboxLabel, { color: colors.softText1 }]}>
            I have read and accept the
            <Text
              style={{ color: colors.link }}
              onPress={() => Linking.openURL(EULA_URL)}
            >
              {" "}
              EULA
            </Text>
            <Text> and the</Text>
            <Text
              style={{ color: colors.link }}
              onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
            >
              {" "}
              Privacy Policy.
            </Text>
          </Text>
        </View>

        <AuthErrorComponent />

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
  checkboxContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 5,
    marginRight: 30,
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
