import React, { useEffect, useRef, useState } from "react";
import { View, SafeAreaView, StyleSheet, AppState, Pressable } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import CameraScanner from "@/components/CameraScanner";
import BottomSheet from "@/components/ButtomSheet";

export default function Home() {
  const router = useRouter();
  const navigation = useNavigation();
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [scannedData, setScannedData] = useState<string[]>([]);

  useEffect(() => {
    navigation.setOptions({
      title: "Lector QR",
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: "black",
      },
      headerLeft: () => (
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" color="white" size={24} style={{ marginRight: 10 }} />
        </Pressable>
      ),
    });
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, []);

  const handleBarcodeScanned = (data: string) => {
    if (data && !qrLock.current && !scannedData.includes(data)) {
      qrLock.current = true;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setScannedData((prev) => [...prev, data]);
      setTimeout(() => {
        qrLock.current = false;
      }, 500);
    }
  };

  const handleDeleteItem = (itemToDelete: string) => {
    setScannedData((prev) => prev.filter((item) => item !== itemToDelete));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraScanner onBarcodeScanned={handleBarcodeScanned} />
      </View>
      <BottomSheet scannedData={scannedData} onDeleteItem={handleDeleteItem} onSend={() => console.log("Enviando...")} />
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
});
