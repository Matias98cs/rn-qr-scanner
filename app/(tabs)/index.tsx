import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  useColorScheme,
  Alert,
} from "react-native";
import { router, Stack } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { PermissionsStatus } from "@/infrastructure/interfaces/camera";
import { usePermissionnsStore } from "@/presentations/store/usePermissions";

export default function Home() {
  const { cameraStatus, requestCameraPermissions } = usePermissionnsStore();
  const isPermissionGranted = cameraStatus === PermissionsStatus.GRANTED;
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const colorIcon = isPermissionGranted ? iconColor : "grey";


  const handlePress = async () => {
    if (isPermissionGranted) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push("/scanner");
    } else {
      Alert.alert(
        "Permiso Requerido",
        "Para usar el escáner QR, debes habilitar los permisos en ajustes.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Ir a Ajustes",
            onPress: () => router.replace("/(tabs)/configuration"),
          },
        ]
      );
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

      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.qrButtonContainer,
          {
            backgroundColor: colorScheme === "dark" ? "white" : "#252525",
            shadowColor: textColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
            zIndex: 5,
            opacity: !isPermissionGranted ? 0.5 : 1,
          },
        ]}
      >
        <Ionicons name="qr-code-outline" size={35} color={colorIcon} />
      </Pressable>
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
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
