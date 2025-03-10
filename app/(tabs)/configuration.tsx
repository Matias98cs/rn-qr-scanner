import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Switch,
  Platform,
  useColorScheme,
} from "react-native";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { usePermissionsStore } from "@/presentations/store/usePermissionsStore";
import { PermissionsStatus } from "@/infrastructure/interfaces/camera";

const isAndroid = Platform.OS === "android";

const Configuration = () => {
  const {
    cameraStatus,
    requestCameraPermissions,
    checkCameraPermissions,
    storageStatus,
    requestStoragePermissions,
    checkStoragePermissions,
  } = usePermissionsStore();

  const isCameraGranted = cameraStatus === PermissionsStatus.GRANTED;
  const isStorageGranted = storageStatus === PermissionsStatus.GRANTED;
  const colorScheme = useColorScheme();

  useEffect(() => {
    checkCameraPermissions();
    checkStoragePermissions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Configuraciones",
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerTitleStyle: {
            color: useThemeColor({}, "text"),
            fontWeight: "bold",
          },
        }}
      />

      <View style={styles.content}>
        <Text style={[styles.title, { color: useThemeColor({}, "text") }]}>
          Configuración de permisos
        </Text>

        {/* Permiso de Cámara */}
        <View style={styles.permissionCard}>
          <Text
            style={[
              styles.permissionText,
              { color: useThemeColor({}, "text") },
            ]}
          >
            Permiso de cámara
          </Text>
          <Switch
            value={isCameraGranted}
            onValueChange={async () => {
              try {
                await requestCameraPermissions();
              } catch (error) {
                console.error("Error al solicitar permisos de cámara:", error);
              }
            }}
            thumbColor={isAndroid ? "white" : "white"}
            trackColor={{
              false: colorScheme === "dark" ? "grey" : "lightgrey",
              true: colorScheme === "dark" ? "white" : "#252525",
            }}
          />
        </View>

        {/* Permiso de Almacenamiento */}
        <View style={styles.permissionCard}>
          <Text
            style={[
              styles.permissionText,
              { color: useThemeColor({}, "text") },
            ]}
          >
            Permiso de almacenamiento
          </Text>
          <Switch
            value={isStorageGranted}
            onValueChange={async () => {
              try {
                await requestStoragePermissions();
              } catch (error) {
                console.error(
                  "Error al solicitar permisos de almacenamiento:",
                  error
                );
              }
            }}
            thumbColor={isAndroid ? "white" : "white"}
            trackColor={{
              false: colorScheme === "dark" ? "grey" : "lightgrey",
              true: colorScheme === "dark" ? "white" : "#252525",
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Configuration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  content: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  permissionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#252525",
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  permissionText: {
    fontSize: 16,
  },
});
