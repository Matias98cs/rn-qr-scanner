import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  useColorScheme,
} from "react-native";
import { Link, Stack } from "expo-router";
import { useCameraPermissions } from "expo-camera";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export default function Home() {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");

  const handlePress = () => {
    if (isPermissionGranted) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Overview",
          headerShown: false,
        }}
      />
      <Text style={[styles.title, { color: textColor }]}>QR Scanner</Text>
      <Link
        href={"/scanner"}
        asChild
        style={[
          styles.qrButtonContainer,
          {
            backgroundColor: colorScheme === "dark" ? "white" : "#252525",
            shadowColor: textColor,
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
            zIndex: 5,
          },
        ]}
      >
        <Pressable
          disabled={!isPermissionGranted}
          onPress={handlePress}
          style={({ pressed }) => [
            styles.qrButton,
            {
              opacity: !isPermissionGranted ? 0.5 : 1,
              backgroundColor: pressed ? "#404040" : "black",
            },
          ]}
        >
          <Ionicons name="qr-code-outline" size={35} color={iconColor} />
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 80,
  },
  title: {
    fontSize: 40,
  },
  buttonStyle: {
    color: "#0E7AFE",
    fontSize: 20,
    textAlign: "center",
  },
  qrButtonContainer: {
    position: "absolute",
    bottom: 150,
    alignSelf: "center",
    padding: 10,
    borderRadius: 10,
    zIndex: 999,
  },
  qrButton: {
    backgroundColor: "black",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
});
