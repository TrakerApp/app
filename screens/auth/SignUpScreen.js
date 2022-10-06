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
  }

  const handleSignUpPress = (data) => {
    console.log("SIGNUP: :", data);
    // handleSignUp()
  };

  return (
    <View style={styles.rootContainer}>
      <Title>Welcome to Tracker!</Title>
      <Text>All your data is backed up and you can even use your same account across all your devices!</Text>
      <TextInput
        name="email"
        mode="outlined"
        error={errors.email}
        label="Email"
        placeholder="Drink Water"
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
        onChangeText={(text) => setValue("password", text)}
        {...register("password", {
          required: true,
          validate: {
            requiredInput: (value) => value.trim() !== "",
          },
        })}
      />

      <Button mode="outlined" onPress={handleSubmit(handleSignUpPress)}>
        Sign Up
      </Button>

      <Button mode="text" onPress={handleGoToSignIn}>
        Already have an account? Sign in
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
});
