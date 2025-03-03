import React, { useEffect, useRef, useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  AppState,
  Pressable,
  Alert,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import CameraScanner from "@/components/CameraScanner";
import { useSQLiteContext } from "expo-sqlite";
import { createSession, saveQrCode } from "@/database/qrRepository";
import BottomSheet from "@/components/ButtomSheet";

export default function Scanner() {
  const router = useRouter();
  const navigation = useNavigation();
  const database = useSQLiteContext();
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [scannedData, setScannedData] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({
      title: "Lector QR",
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: "black",
      },
      headerLeft: () => (
        <Pressable onPress={() => router.back()}>
          <Ionicons
            name="arrow-back-outline"
            color="white"
            size={24}
            style={{ marginRight: 10 }}
          />
        </Pressable>
      ),
    });
  }, []);

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

  useEffect(() => {
    const startNewSession = async () => {
      try {
        const newSessionId = await createSession(
          database,
          `Escaneo ${new Date().toLocaleString()}`
        );
        setSessionId(newSessionId);
      } catch (error) {
        console.error("Error al crear sesión:", error);
      }
    };
    startNewSession();
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

  const handleSend = async () => {
    if (!sessionId) {
      Alert.alert("Error", "No hay sesión activa.");
      return;
    }

    if (scannedData.length === 0) {
      Alert.alert("No hay datos", "No has escaneado ningún código.");
      return;
    }

    try {
      for (const data of scannedData) {
        await saveQrCode(database, sessionId, data, null);
      }
      Alert.alert("Códigos guardados", "Se han guardado correctamente.");
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al guardar los códigos.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraScanner onBarcodeScanned={handleBarcodeScanned} />
      </View>
      <BottomSheet
        scannedData={scannedData}
        onDeleteItem={handleDeleteItem}
        onSend={handleSend}
      />
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
