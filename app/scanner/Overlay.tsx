import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";


export default function Overlay() {
  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          title: "Overview",
          headerShown: false
        }}
      />
    </SafeAreaView>
  )
}
