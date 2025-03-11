import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import * as Haptics from "expo-haptics";
import React, { useState, useRef } from "react";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";
import Share from "react-native-share";
import { useThemeColor } from "@/hooks/useThemeColor";
import { postGenerateQr } from "@/core/generateQR/generate-qr";
import { Ionicons } from "@expo/vector-icons";

const GenerateQr = () => {
  const [inputUrl, setInputUrl] = useState<string>("");
  const [loadingQr, setLoadingQr] = useState<boolean>(false);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const qrRef = useRef<View>(null);

  const { height } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, "text");

  const isDark = colorScheme === "dark";
  const backgroundColor = isDark ? "black" : "#FFFFFF";
  const iconBackgroundColor = isDark ? "#FFFFFF" : "#252525";
  const iconColor = isDark ? "#252525" : "#FFFFFF";

  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Se necesita acceso a la galería.");
      return false;
    }
    return true;
  };

  const generateQrCode = async () => {
    if (!inputUrl.trim()) {
      alert("Por favor ingresa un link válido.");
      return;
    }

    setLoadingQr(true);

    try {
      const response = await postGenerateQr(inputUrl);
      if (response) {
        setQrImageUrl(response.qr_image_base64);
      } else {
        alert("Error al generar el QR. Intenta de nuevo.");
      }
    } catch (error) {
      alert("Ocurrió un error al generar el QR.");
    } finally {
      setLoadingQr(false);
    }
  };

  const saveQrToGallery = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!qrImageUrl) {
      Alert.alert("Error", "No hay un código QR para guardar.");
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const localUri = await captureRef(qrRef, {
        format: "png",
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      Alert.alert("Guardado", "El QR se ha guardado en tu galería.");
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar la imagen.");
      console.error("Error guardando la imagen:", error);
    }
  };

  const shareQr = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!qrImageUrl) {
      Alert.alert("Error", "No hay un código QR para compartir.");
      return;
    }

    try {
      const localUri = await captureRef(qrRef, {
        format: "png",
        quality: 1,
      });

      await Share.open({
        url: localUri,
        type: "image/png",
        message: "Aquí tienes tu código QR",
      });
    } catch (error) {
      // console.error("Error al compartir:", error);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          paddingTop: height * 0.05,
          backgroundColor: backgroundColor,
        },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={[styles.title, { color: textColor }]}>Genera tu QR</Text>
        <Text style={[styles.subtitle, { color: textColor }]}>
          Ingresa un link para generar tu QR
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            value={inputUrl}
            onChangeText={setInputUrl}
            placeholder="https://ejemplo.com"
            placeholderTextColor={textColor}
            style={[
              styles.input,
              { borderColor: iconBackgroundColor, color: textColor },
            ]}
          />
          <Pressable
            onPress={generateQrCode}
            disabled={loadingQr}
            style={[
              styles.button,
              {
                backgroundColor: iconBackgroundColor,
                opacity: loadingQr ? 0.5 : 1,
              },
            ]}
          >
            {loadingQr ? (
              <ActivityIndicator size="small" color={iconColor} />
            ) : (
              <Text style={{ color: iconColor }}>Generar</Text>
            )}
          </Pressable>
        </View>

        {loadingQr && (
          <View style={styles.qrContainer}>
            <ActivityIndicator size="large" color={iconBackgroundColor} />
          </View>
        )}

        {qrImageUrl && !loadingQr && (
          <>
            <View style={styles.qrContainer} ref={qrRef} collapsable={false}>
              <Image
                style={styles.qrImage}
                source={{
                  uri: qrImageUrl.startsWith("data:image/png;base64,")
                    ? qrImageUrl
                    : `data:image/png;base64,${qrImageUrl}`,
                }}
              />
            </View>
            <View style={styles.iconContainer}>
              <Pressable onPress={saveQrToGallery}>
                <Ionicons
                  name="download-outline"
                  color={iconBackgroundColor}
                  size={30}
                />
              </Pressable>

              <Pressable onPress={shareQr}>
                <Ionicons
                  name="share-social-outline"
                  color={iconBackgroundColor}
                  size={30}
                />
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default GenerateQr;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 150,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  inputContainer: {
    paddingTop: 20,
    width: "100%",
    alignItems: "center",
    gap: 10,
  },
  input: {
    borderWidth: 1,
    width: "90%",
    borderRadius: 15,
    padding: 8,
  },
  button: {
    padding: 12,
    borderRadius: 10,
    width: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  qrContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  qrImage: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    gap: 30,
  },
});
