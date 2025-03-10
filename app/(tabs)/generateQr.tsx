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
} from "react-native";
import React, { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { postGenerateQr } from "@/core/generateQR/generate-qr";
import { Ionicons } from "@expo/vector-icons";
import { Share } from "react-native";

const GenerateQr = () => {
  const [inputUrl, setInputUrl] = useState<string>("");
  const [loadingQr, setLoadingQr] = useState<boolean>(false);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);

  const { height } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, "text");

  const isDark = colorScheme === "dark";
  const iconBackgroundColor = isDark ? "#FFFFFF" : "#252525";
  const iconColor = isDark ? "#252525" : "#FFFFFF";

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

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: height * 0.07,
          paddingHorizontal: 16,
        },
      ]}
    >
      <Text style={{ color: textColor, fontSize: 30, fontWeight: "bold" }}>
        Genera tu QR
      </Text>
      <Text style={{ color: textColor }}>
        Ingresa un link para generar tu QR
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          value={inputUrl}
          onChangeText={setInputUrl}
          placeholder="https://ejemplo.com"
          style={[
            styles.input,
            {
              borderColor: iconBackgroundColor,
              color: textColor,
            },
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
        <View style={styles.qrContainer}>
          <Image style={styles.qrImage} source={{ uri: qrImageUrl }} />
        </View>
      )}

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignContent: "center",
          marginTop: 30,
          gap: 30,
        }}
      >
        <Ionicons name="download-outline" color={"black"} size={30} />

        <Ionicons name="share-social-outline" color={"black"} size={30} />
      </View>
    </SafeAreaView>
  );
};

export default GenerateQr;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  inputContainer: {
    paddingTop: 20,
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  input: {
    borderWidth: 1,
    width: "100%",
    borderRadius: 15,
    padding: 8,
  },
  button: {
    padding: 12,
    borderRadius: 10,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  qrContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  qrImage: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});
