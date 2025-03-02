import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Switch,
  Platform,
  useColorScheme,
} from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useCameraPermissions } from "expo-camera";

const isAndroid = Platform.OS === "android";

const Configuration = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  const colorScheme = useColorScheme();

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
          Esta es la pantalla de configuraciones
        </Text>
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
            value={isPermissionGranted}
            onValueChange={async () => {
              await requestPermission();
            }}
            thumbColor={isAndroid ? "white" : "white"}
            trackColor={{
              false: colorScheme === "dark" ? "grey" : "grey",
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
    borderWidth: 0.6,
    padding: 12,
    borderRadius: 10,
  },
  permissionText: {
    fontSize: 16,
  },
});
