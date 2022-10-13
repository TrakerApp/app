import { useState } from "react";
import { TextInput } from "react-native-paper";

export function AuthEmailInput({
  autoFocus = false,
  loading,
  defaultValue,
  error,
  style,
  setValue,
  register,
}) {
  return (
    <TextInput
      name="email"
      disabled={loading}
      autoComplete="email"
      autoCapitalize="none"
      autoCorrect={false}
      autoFocus={autoFocus}
      defaultValue={defaultValue}
      keyboardType="email-address"
      textContentType="emailAddress"
      mode="outlined"
      error={error}
      label="Email"
      left={<TextInput.Icon name="at" />}
      placeholder="john@gmail.com"
      style={style}
      onChangeText={(text) => setValue("email", text)}
      {...register("email", {
        required: true,
        validate: {
          requiredInput: (value) => value.trim() !== "",
        },
      })}
    />
  );
}

export function AuthPasswordInput({
  label,
  loading,
  error,
  style,
  setValue,
  register,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleEyePress = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <TextInput
      name="password"
      disabled={loading}
      secureTextEntry={!showPassword}
      textContentType="password"
      mode="outlined"
      error={error}
      label={label}
      style={style}
      left={<TextInput.Icon name="form-textbox-password" />}
      onChangeText={(text) => setValue("password", text)}
      right={<TextInput.Icon name="eye" onPress={handleEyePress} />}
      {...register("password", {
        required: true,
        validate: {
          requiredInput: (value) => value.trim() !== "",
        },
      })}
    />
  );
}

export function AuthCodeInput({
  autoFocus = false,
  label,
  loading,
  style,
  error,
  setValue,
  register,
}) {
  return (
    <TextInput
      name="code"
      disabled={loading}
      autoComplete="off"
      autoCapitalize="none"
      autoCorrect={false}
      autoFocus={autoFocus}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      mode="outlined"
      error={error}
      label={label}
      style={style}
      left={<TextInput.Icon name="email" />}
      onChangeText={(text) => setValue("code", text)}
      {...register("code", {
        required: true,
        validate: {
          requiredInput: (value) => value.trim() !== "",
        },
      })}
    />
  );
}
