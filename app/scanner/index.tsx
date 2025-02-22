import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  AppState,
  Platform,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";
import { CameraView } from "expo-camera";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Overlay from "./Overlay";

export default function Home() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [scannedData, setScannedData] = useState<string[]>([]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, []);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (data && !qrLock.current && !scannedData.includes(data)) {
      qrLock.current = true;
      setScannedData((prev) => [...prev, data]);
      setTimeout(() => {
        qrLock.current = false;
      }, 500);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Overview", headerShown: false }} />
      {Platform.OS === "android" && <StatusBar hidden />}

      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={handleBarcodeScanned}
        />
        <Overlay />
        {/* Contenedor de datos más grande */}
        <View style={styles.dataContainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {scannedData.length > 0 ? (
              scannedData.map((item, index) => (
                <Text key={index} style={styles.dataText}>
                  * {item}
                </Text>
              ))
            ) : (
              <Text style={styles.dataText}>
                Escanea un código para mostrar la data
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    position: "relative",
  },
  dataContainer: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    height: 200,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 10,
    padding: 16,
    overflow: "hidden",
  },
  scrollViewContent: {
    padding: 8,
  },
  dataText: {
    fontSize: 16,
    marginBottom: 4,
  },
});
