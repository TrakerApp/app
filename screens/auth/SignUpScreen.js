import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import {
  Button,
  IconButton,
  Text,
  TextInput,
  Portal,
  Modal,
} from "react-native-paper";
import Title from "../../components/ui/Title";
import { signUp, signIn } from "../../util/auth";

export default function SignUpScreen({ handleSignUp, navigation }) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" }, // TODO: TK-29
  });

  const handleGoToSignIn = () => {
    navigation.navigate("SignIn");
  };

  const handleSignUpPress = async (data) => {
    console.log("SIGNUP: :", data);
    const res = await signUp(data.email, data.password);
    const { user, userConfirmed, userSub } = res;
    console.log("res:", res)
    console.log("user:", user)
    console.log("userConfirmed:", userConfirmed)
    console.log("userSub:", userSub)

    // const res = await confirmSignUp(data.email, "050483")
    // this works but we get USER_PASSWORD_AUTH flow not enabled for this client

    // const res = await signIn(data.email, data.password)
    // console.log("in screen res:", res)
    // this works but we get USER_PASSWORD_AUTH flow not enabled for this client

    // signUp(data.email, data.password)
    // handleSignUp()
  };

  return (
    <View style={styles.rootContainer}>
      <Title style={styles.title}>Welcome to Tracker</Title>
      <Text style={styles.subtitle}>
        Sign up now and start tracking all your behaviors and habits in a single place!
      </Text>
      <View style={styles.formContainer}>
        <TextInput
          name="email"
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

        <Button
          style={styles.outlinedButton}
          mode="outlined"
          onPress={handleSubmit(handleSignUpPress)}
        >
          Sign Up
        </Button>

        <Button style={styles.textButton} mode="text" onPress={handleGoToSignIn}>
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
  }
});
