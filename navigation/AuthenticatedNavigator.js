import { createDrawerNavigator } from "@react-navigation/drawer";
import TrackingsScreen from "../screens/TrackingsScreen";
import TrackingScreen from "../screens/TrackingScreen";

import DrawerContent from "../components/drawer/Content";
import useColors from "../util/hooks/useColors";

const Drawer = createDrawerNavigator();

export default function AuthenticatedNavigator() {
  const colors = useColors()

  return (
    <Drawer.Navigator drawerContent={() => <DrawerContent />} screenOptions={{
      headerTintColor: colors.softText1,
      headerTitleAlign: "center"
    }}>
      <Drawer.Screen name="Your Trackings" component={TrackingsScreen} />
      <Drawer.Screen name="Tracking" component={TrackingScreen} />
    </Drawer.Navigator>
  );
}
