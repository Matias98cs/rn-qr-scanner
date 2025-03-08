import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { router, useNavigation } from "expo-router";
import * as Haptics from "expo-haptics";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { usePermissionnsStore } from "@/presentations/store/usePermissions";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Share } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";

import { useSessions } from "@/hooks/useSessions";
import { SessionCard } from "@/components/SessionCard";
import { QRButton } from "@/components/QRButton";
import { QrCode } from "@/infrastructure/interfaces/qr";
import { Session } from "@/infrastructure/interfaces/sessions";
import {
  deleteSession,
  editNameSession,
  getQrCodesBySession,
} from "@/database/qrRepository";
import { useSQLiteContext } from "expo-sqlite";
import LoadingScreen from "@/components/LoadingScreen";

type TabsNavigationProp = BottomTabNavigationProp<{
  index: undefined;
  configuration: undefined;
}>;

export default function Home() {
  const database = useSQLiteContext();
  const [loading, setLoading] = useState<boolean>(false);
  const {
    setSessions,
    setQrCodes,
    sessions,
    qrCodes,
    loading: loadingSession,
    error,
    refetch,
  } = useSessions();
  const { cameraStatus } = usePermissionnsStore();
  const isPermissionGranted = cameraStatus === "GRANTED";
  const textColor = useThemeColor({}, "text");
  const { showActionSheetWithOptions } = useActionSheet();
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const navigation = useNavigation<TabsNavigationProp>();

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

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
        .map((qr: QrCode) => `Texto: ${qr.text}\nURL: ${qr.url ? qr.url : ""}`)
        .join("\n\n");

      await Share.share({ message: formattedResponse });
    } catch (error) {
      Alert.alert("Error compartiendo", "Ha ocurrido un error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ses: Session) => {
    try {
      await deleteSession(database, ses.id);
      setSessions((prevSessions) =>
        prevSessions.filter((s) => s.id !== ses.id)
      );
      setQrCodes((prevQrCodes) => {
        const updated = { ...prevQrCodes };
        delete updated[ses.id];
        return updated;
      });
    } catch (error) {
      Alert.alert("Error borrando", "Ha ocurrido un error.");
    }
  };

  const handleSeeMore = async (ses: Session) => {
    const options = ["Borrar", "Cancelar"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex?: number) => {
        if (selectedIndex === undefined) return;
        if (selectedIndex === destructiveButtonIndex) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          handleDelete(ses);
        } else if (selectedIndex === cancelButtonIndex) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          // console.log("No hago nada...");
        }
      }
    );
  };

  const handleEditSessionName = async (id: string, newName: string) => {
    try {
      await editNameSession(database, id, newName);
      setSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.id === id ? { ...session, name: newName } : session
        )
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Ha ocurrido un error al editar el nombre de la sesión."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {!keyboardVisible && (
        <QRButton
          onPress={handlePress}
          isPermissionGranted={isPermissionGranted}
        />
      )}
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
            isEditing={editingSessionId === item.id}
            setEditingSessionId={setEditingSessionId}
            handleEditSessionName={handleEditSessionName}
          />
        )}
        />
        {
          loading && (
            <LoadingScreen/>
          )
        }
    </KeyboardAvoidingView>
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
