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

const isAndroid = Platform.OS === "android";

const Configuration = () => {
  const [cameraPermision, setCameraPermision] = useState(false);
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
        <View
          style={[styles.permissionCard, { backgroundColor: "transparent" }]}
        >
          <Text
            style={[
              styles.permissionText,
              { color: useThemeColor({}, "text") },
            ]}
          >
            Permiso de cámara
          </Text>
          <Switch
            value={cameraPermision}
            onValueChange={() => setCameraPermision(!cameraPermision)}
            thumbColor={isAndroid ? "white" : "white"}
            trackColor={{
              false: colorScheme === "dark" ? "grey" : "lightgrey",
              true: "white",
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
