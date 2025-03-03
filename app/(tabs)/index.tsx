import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  useColorScheme,
  Alert,
  FlatList,
} from "react-native";
import { router, Stack } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { PermissionsStatus } from "@/infrastructure/interfaces/camera";
import { usePermissionnsStore } from "@/presentations/store/usePermissions";
import { useNavigation } from "expo-router";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import { getSessions, getQrCodesBySession } from "@/database/qrRepository";
import { useSQLiteContext } from "expo-sqlite";
import { QrCode } from "@/infrastructure/interfaces/qr";
import { Session } from "@/infrastructure/interfaces/sessions";

type TabsNavigationProp = BottomTabNavigationProp<{
  index: undefined;
  configuration: undefined;
}>;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) +
    " " +
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  );
};

export default function Home() {
  const database = useSQLiteContext();
  const { cameraStatus } = usePermissionnsStore();
  const isPermissionGranted = cameraStatus === PermissionsStatus.GRANTED;
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");

  const colorIcon = isPermissionGranted
    ? iconColor
    : colorScheme === "dark"
    ? "rgba(255, 255, 255, 0.6)"
    : "rgba(0, 0, 0, 0.5)";

  const navigation = useNavigation<TabsNavigationProp>();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [qrCodes, setQrCodes] = useState<Record<string, QrCode[]>>({});

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await getSessions(database);
        setSessions(data);

        const qrData: Record<string, QrCode[]> = {};
        for (const session of data) {
          const qrCodesForSession = await getQrCodesBySession(
            database,
            session.id
          );
          qrData[session.id] = qrCodesForSession;
        }
        setQrCodes(qrData);
      } catch (error) {
        console.error("Error al obtener sesiones:", error);
      }
    };

    loadSessions();
  }, []);

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

  return (
    <SafeAreaView style={styles.container}>
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
        scrollEnabled={true}
        renderItem={({ item }) => (
          <View style={styles.sessionCard}>
            <Text style={[styles.sessionTitle, { color: textColor }]}>
              {item.name}
            </Text>
            <Text style={styles.sessionDate}>
              {formatDate(item.created_at)}
            </Text>

            {qrCodes[item.id]?.length > 0 ? (
              qrCodes[item.id].map((qr) => (
                <View key={qr.id} style={styles.qrItem}>
                  <Ionicons
                    name="qr-code-outline"
                    size={24}
                    color={colorScheme === "dark" ? "white" : "black"}
                  />
                  <Text style={[styles.qrText, { color: textColor }]}>
                    {qr.text}
                  </Text>
                </View>
              ))
            ) : (
              <Text
                style={{
                  color: textColor,
                  fontSize: 16,
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                No hay códigos en esta sesión
              </Text>
            )}
          </View>
        )}
      />
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.qrButtonContainer,
          {
            backgroundColor: colorScheme === "dark" ? "white" : "#252525",
            shadowColor: textColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
            opacity: !isPermissionGranted ? 0.5 : 1,
          },
        ]}
      >
        <Ionicons name="qr-code-outline" size={35} color={colorIcon} />
      </Pressable>
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
  sessionCard: {
    width: "100%",
    backgroundColor: "#252525",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sessionDate: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },
  qrItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  qrText: {
    fontSize: 14,
    marginLeft: 10,
  },
  footerSpace: {
    height: 100,
  },
  qrButtonContainer: {
    position: "absolute",
    bottom: 130,
    alignSelf: "center",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
