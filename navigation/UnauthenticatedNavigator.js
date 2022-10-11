import { createStackNavigator } from "@react-navigation/stack";
import SignUpScreen from "../screens/auth/SignUpScreen";
import SignInScreen from "../screens/auth/SignInScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";
import ConfirmationScreen from "../screens/auth/ConfirmationScreen";

const Stack = createStackNavigator();

export default function UnauthenticatedNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="SignUp"
        component={SignUpScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="SignIn"
        component={SignInScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Confirmation"
        component={ConfirmationScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="ResetPassword"
        component={ResetPasswordScreen}
      />
    </Stack.Navigator>
  );
}
