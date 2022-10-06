import { createDrawerNavigator } from "@react-navigation/drawer";
import TrackingsScreen from "../screens/TrackingsScreen";
import TrackingScreen from "../screens/TrackingScreen";

import DrawerContent from "../components/drawer/Content";

const Drawer = createDrawerNavigator();

export default function AuthenticatedNavigator() {
  return (
    <Drawer.Navigator drawerContent={() => <DrawerContent />}>
      <Drawer.Screen name="Your Trackings" component={TrackingsScreen} />
      <Drawer.Screen name="Tracking" component={TrackingScreen} />
    </Drawer.Navigator>
  );
}
