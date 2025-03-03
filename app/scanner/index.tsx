import React, { useEffect, useRef } from "react";
import { View, SafeAreaView, StyleSheet, Pressable, Alert } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import CameraScanner from "@/components/CameraScanner";
import { useSQLiteContext } from "expo-sqlite";
import { saveQrCode, deleteSession } from "@/database/qrRepository";
import BottomSheet from "@/components/ButtomSheet";

import { useSession } from "@/hooks/useSession";
import { useQrLock } from "@/hooks/useQrLock";
import { useScannedData } from "@/hooks/useScannedData";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function Scanner() {
  const router = useRouter();
  const textColor = useThemeColor({}, "text");
  const navigation = useNavigation();
  const database = useSQLiteContext();
  const sessionId = useSession();
  const { lock, unlock, isLocked } = useQrLock();
  const { scannedData, addData, deleteData } = useScannedData();
  const scannedDataRef = useRef(scannedData);

  useEffect(() => {
    navigation.setOptions({
      title: "Lector QR",
      headerShadowVisible: false,
      headerStyle: { backgroundColor: "transparent" },
      headerLeft: () => (
        <Pressable onPressOut={() => router.back()}>
          <Ionicons
            name="arrow-back-outline"
            color={textColor}
            size={24}
            style={{ marginRight: 10 }}
          />
        </Pressable>
      ),
    });
  }, [navigation, router, textColor]);

  useEffect(() => {
    scannedDataRef.current = scannedData;
  }, [scannedData]);

  useEffect(() => {
    return () => {
      if (scannedDataRef.current.length === 0 && sessionId) {
        deleteSession(database, sessionId)
          .then(() => console.log("Sesión eliminada por no tener códigos"))
          .catch((err) =>
            console.error("Error eliminando sesión sin códigos:", err)
          );
      }
    };
  }, [database, sessionId]);

  const handleBarcodeScanned = (data: string) => {
    if (data && !isLocked() && !scannedData.includes(data)) {
      lock();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      addData(data);
      setTimeout(() => {
        unlock();
      }, 500);
    }
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
        onDeleteItem={deleteData}
        onSend={handleSend}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cameraContainer: { flex: 1, position: "relative" },
});
