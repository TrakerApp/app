import { useEffect } from "react";
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
import { currentAuthenticatedUser } from '../../util/auth'

export default function SignInScreen({ handleSignIn, navigation }) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" }, // TODO: TK-29
  });

  useEffect(() => {
    const load = async () => {
      const possible = await currentAuthenticatedUser()
      console.log("possible user on sign in:", possible)
    }
    load()
  }, [])

  const handleGoToSignUp = () => {
    navigation.navigate("SignUp");
  };

  const handleGoToPasswordReset = () => {
    navigation.navigate("ResetPassword");
  };

  const handleSignInPress = (data) => {
    console.log("SIGNUP: :", data);
    // handleSignIn()
  };

  return (
    <View style={styles.rootContainer}>
      <Title style={styles.title}>Sign In</Title>
      <Text style={styles.subtitle}>Welcome back!</Text>
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
          onPress={handleSubmit(handleSignInPress)}
        >
          Sign In
        </Button>
        <View style={styles.linksContainer}>
          <Button mode="text" onPress={handleGoToSignUp}>
            New to Traker? Sign up now!
          </Button>
          <Button mode="text" onPress={handleGoToPasswordReset}>
            Password lost? Recover it
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
