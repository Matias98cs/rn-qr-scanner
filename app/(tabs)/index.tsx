import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  useColorScheme,
} from "react-native";
import { router, useNavigation } from "expo-router";
import * as Haptics from "expo-haptics";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { usePermissionnsStore } from "@/presentations/store/usePermissions";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as Sharing from "expo-sharing";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { Share } from "react-native";

import { useSessions } from "@/hooks/useSessions";
import { SessionCard } from "@/components/SessionCard";
import { QRButton } from "@/components/QRButton";
import { QrCode } from "@/infrastructure/interfaces/qr";
import { Session } from "@/infrastructure/interfaces/sessions";
import { getQrCodesBySession } from "@/database/qrRepository";
import { useSQLiteContext } from "expo-sqlite";
import LoadingScreen from "@/components/LoadingScreen";

type TabsNavigationProp = BottomTabNavigationProp<{
  index: undefined;
  configuration: undefined;
}>;

export default function Home() {
  const database = useSQLiteContext();
  const [loading, setLoading] = useState<boolean>(false);
  const { sessions, qrCodes, loading: loadingSession, error } = useSessions();
  const { cameraStatus } = usePermissionnsStore();
  const isPermissionGranted = cameraStatus === "GRANTED";
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, "text");

  const navigation = useNavigation<TabsNavigationProp>();

  if (loadingSession) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  const handlePress = async () => {
    if (isPermissionGranted) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push("/scanner");
    } else {
      Alert.alert(
        "Permiso Requerido",
        "Para usar el escáner QR, debes habilitar los permisos en ajustes.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Ir a Ajustes",
            onPress: () => {
              setTimeout(() => {
                navigation.navigate("configuration");
              }, 100);
            },
          },
        ]
      );
    }
  };

  const handleShare = async (ses: Session) => {
    setLoading(true);
    try {
      const response = await getQrCodesBySession(database, ses.id);
      const formattedResponse = response
        .map((qr: QrCode) => `Nombre: ${qr.text}\nURL: ${qr.url ? qr.url : ""}`)
        .join("\n\n");

      console.log(formattedResponse);
      await Share.share({ message: formattedResponse });
    } catch (error) {
      console.error("Error compartiendo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeeMore = () => {
    console.log("Ver más");
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && <LoadingScreen />}
      <FlatList
        style={styles.list}
        data={sessions}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={[styles.noDataText, { color: textColor }]}>
            No tienes códigos QR escaneados aún.
          </Text>
        }
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: textColor }]}>QR Scanner</Text>
          </View>
        }
        ListFooterComponent={<View style={styles.footerSpace} />}
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            qrCodes={qrCodes[item.id] || []}
            handleShare={handleShare}
            handleSeeMore={handleSeeMore}
          />
        )}
      />
      <QRButton
        onPress={handlePress}
        isPermissionGranted={isPermissionGranted}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerContainer: {
    alignItems: "center",
    paddingBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  noDataText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  footerSpace: {
    height: 100,
  },
});
