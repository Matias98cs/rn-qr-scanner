import React from "react";
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

// Hooks y componentes importados
import { useSessions } from "@/hooks/useSessions";
import { SessionCard } from "@/components/SessionCard";
import { QRButton } from "@/components/QRButton";

type TabsNavigationProp = BottomTabNavigationProp<{
  index: undefined;
  configuration: undefined;
}>;

export default function Home() {
  const { sessions, qrCodes } = useSessions();
  const { cameraStatus } = usePermissionnsStore();
  const isPermissionGranted = cameraStatus === "GRANTED";
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, "text");

  const navigation = useNavigation<TabsNavigationProp>();

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
        renderItem={({ item }) => (
          <SessionCard session={item} qrCodes={qrCodes[item.id] || []} />
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
