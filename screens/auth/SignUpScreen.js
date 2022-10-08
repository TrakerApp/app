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

  const handleSignUpPress = (data) => {
    console.log("SIGNUP: :", data);
    // handleSignUp()
  };

  return (
    <View style={styles.rootContainer}>
      <Title style={styles.title}>Welcome to Tracker!</Title>
      <Text style={styles.subtitle}>
        All your data is backed up and you can even use your same account across
        all your devices!
      </Text>
      <View style={styles.formContainer}>
        <TextInput
          name="email"
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
