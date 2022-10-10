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
import { confirmSignUp, resendConfirmationCode } from "../../util/auth";

export default function ConfirmationScreen({
  handleConfirm,
  navigation,
  route,
}) {
  // const { userEmail } = route.params;
  const userEmail = 'carlosr706+4@gmail.com'
  console.log("loading confirm with userEmail:", userEmail)

  const {
    register,
    setValue,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: { email: userEmail, code: "" }, // TODO: TK-29
  });

  const handleResendCodePress = async () => {
    // navigation.navigate("SignUp");
    console.log("resend code");
    const email = getValues("email")
    const res = await resendConfirmationCode(email);
    console.log("resending res:", res)
  };

  const handleConfirmPress = async (data) => {
    console.log("handleConfirm:", data);
    const res = await confirmSignUp(data.email, data.code);
    console.log("confirmation res:", res)

    // handleConfirm()
  };

  return (
    <View style={styles.rootContainer}>
      <Title style={styles.title}>Confirm</Title>
      <Text style={styles.subtitle}>
        You should have received a 6 digit code in your email, please enter it below.
      </Text>
      <View style={styles.formContainer}>
        <TextInput
          name="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          mode="outlined"
          error={errors.email}
          label="Email"
          placeholder="john@gmail.com"
          style={styles.input}
          defaultValue={userEmail}
          onChangeText={(text) => setValue("email", text)}
          {...register("email", {
            required: true,
            validate: {
              requiredInput: (value) => value.trim() !== "",
            },
          })}
        />

        <TextInput
          name="code"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={true}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          mode="outlined"
          error={errors.code}
          label="code"
          style={styles.input}
          onChangeText={(text) => setValue("code", text)}
          {...register("code", {
            required: true,
            validate: {
              requiredInput: (value) => value.trim() !== "",
            },
          })}
        />

        <Button
          mode="outlined"
          style={styles.outlinedButton}
          onPress={handleSubmit(handleConfirmPress)}
        >
          Confirm
        </Button>
        <View style={styles.linksContainer}>
          <Button mode="text" onPress={handleResendCodePress}>
            You haven't received the code? Resend
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
