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
  return (
    <TextInput
      name="password"
      disabled={loading}
      secureTextEntry={true}
      textContentType="password"
      mode="outlined"
      error={error}
      label={label}
      style={style}
      onChangeText={(text) => setValue("password", text)}
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
      autoFocus={true}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      mode="outlined"
      error={error}
      label={label}
      style={style}
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
