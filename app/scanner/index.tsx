import React, { useEffect, useRef, useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Pressable,
  Alert,
  useColorScheme,
} from "react-native";
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
import LoadingScreen from "@/components/LoadingScreen";

export default function Scanner() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const database = useSQLiteContext();
  const sessionId = useSession();
  const { lock, unlock, isLocked } = useQrLock();
  const { scannedData, addData, deleteData } = useScannedData();
  const scannedDataRef = useRef(scannedData);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const isDark = colorScheme === "dark";
    const headerBackgroundColor = isDark ? "#000000" : "#FFFFFF";
    const headerTextColor = isDark ? "#FFFFFF" : "#252525";
    
    navigation.setOptions({
      title: "Lector QR",
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: headerBackgroundColor,
      },
      headerTitleStyle: { color: headerTextColor },
      headerLeft: () => (
        <Pressable onPressOut={() => router.back()}>
          <Ionicons
            name="arrow-back-outline"
            color={headerTextColor}
            size={24}
            style={{ marginRight: 10 }}
          />
        </Pressable>
      ),
    });
  }, [navigation, router, colorScheme]);

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
    setLoading(true);
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
      Alert.alert(
        "Códigos guardados",
        "Se han guardado correctamente.",
        [{ text: "OK", onPress: () => router.replace("/(tabs)") }],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al guardar los códigos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && <LoadingScreen />}
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
