import { useLayoutEffect } from "react";
import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";

export default function TrackingScreen({ navigation, route }) {
	const { id } = route.params;
	console.log("id is", id)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton size={32} icon="chevron-left" onPress={() => {navigation.goBack()}} />
      ),
			title: "SDF",
    });
  }, [navigation]);

  return (
    <View>
      <Text>HEYY! :)</Text>
    </View>
  );
}
