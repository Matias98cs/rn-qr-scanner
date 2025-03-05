import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  AppState,
  Linking,
} from "react-native";
import { CameraView } from "expo-camera";
import { useEffect, useRef } from "react";

const ScanQRScreen = () => {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);

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

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={({ data }) => {
            if (data && !qrLock.current) {
              qrLock.current = true;
              setTimeout(async () => {
                await Linking.openURL(data);
              }, 500);
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ScanQRScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  cameraContainer: { flex: 1, position: "relative" },
});
