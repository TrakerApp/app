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

export default function ResetPasswordScreen({
  handleResetPassword,
  navigation,
}) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" }, // TODO: TK-29
  });

  const handleGoToSignUp = () => {
    navigation.navigate("SignUp");
  };

  const handleGoToSignIn = () => {
    navigation.navigate("SignIn");
  };

  const handleResetPasswordPress = (data) => {
    console.log("handleResetPassword: :", data);
    // handleResetPassword()
  };

  return (
    <View style={styles.rootContainer}>
      <Title style={styles.title}>Reset Password</Title>
      <Text style={styles.subtitle}>
        We'll send you instructions to reset your password to your email
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

        <Button
          mode="outlined"
          style={styles.outlinedButton}
          onPress={handleSubmit(handleResetPasswordPress)}
        >
          Send reset password instructions
        </Button>
        <View style={styles.linksContainer}>
          <Button mode="text" onPress={handleGoToSignUp}>
            New to Traker? Sign up now!
          </Button>
          <Button mode="text" onPress={handleGoToSignIn}>
            Already have an account? Sign in
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
  input: {
    marginTop: 10,
  },
  outlinedButton: {
    marginTop: 20,
  },
});
