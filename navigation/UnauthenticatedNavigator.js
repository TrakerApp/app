import { createDrawerNavigator } from "@react-navigation/drawer";
import LoginScreen from "../screens/auth/LoginScreen";

const Drawer = createDrawerNavigator();

export default function UnauthenticatedNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Login" component={LoginScreen} />
    </Drawer.Navigator>
  );
}
