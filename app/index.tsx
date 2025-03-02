import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { Link, Stack } from "expo-router";
import { useCameraPermissions } from "expo-camera";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export default function Home() {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  const textColor = useThemeColor({}, "text");

  console.log(isPermissionGranted);

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
      <View style={{ gap: 20, paddingTop: 20 }}>
        <Pressable onPress={requestPermission} disabled={isPermissionGranted}>
          <Text
            style={[
              styles.buttonStyle,
              { color: isPermissionGranted ? "gray" : "#0E7AFE" },
            ]}
          >
            Pedir permisos de camara
          </Text>
        </Pressable>
      </View>

      <Link href={"/scanner"} asChild style={styles.qrButtonContainer}>
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
          <Ionicons
            name="qr-code-outline"
            size={50}
            color={isPermissionGranted ? "white" : "gray"}
          />
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
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#252525",
    padding: 10,
    borderRadius: 10,
  },
  qrButton: {
    backgroundColor: "black",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
});
