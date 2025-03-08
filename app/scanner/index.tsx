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
  const [dataSaved, setDataSaved] = useState(false);

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

  // Listener beforeRemove: si hay datos sin guardar, se pregunta y se elimina la sesión al confirmar salir
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (dataSaved) return;
      if (scannedData.length > 0) {
        e.preventDefault();
        Alert.alert(
          "Datos sin guardar",
          "Has escaneado códigos sin enviarlos. Si sales, se descartarán estos datos. ¿Estás seguro de que deseas salir?",
          [
            { text: "Cancelar", style: "cancel", onPress: () => {} },
            {
              text: "Salir",
              style: "destructive",
              onPress: async () => {
                if (sessionId) {
                  try {
                    await deleteSession(database, sessionId);
                  } catch (err) {
                    console.error("Error eliminando sesión:", err);
                  }
                }
                navigation.dispatch(e.data.action);
              },
            },
          ]
        );
      }
    });
    return unsubscribe;
  }, [navigation, scannedData, dataSaved, sessionId, database]);

  useEffect(() => {
    return () => {
      if (scannedDataRef.current.length === 0 && sessionId) {
        deleteSession(database, sessionId)
          .then(() => {})
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
      setLoading(false);
      return;
    }
    if (scannedData.length === 0) {
      Alert.alert("No hay datos", "No has escaneado ningún código.");
      setLoading(false);
      return;
    }
    try {
      for (const data of scannedData) {
        await saveQrCode(database, sessionId, data, null);
      }
      setDataSaved(true);
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
