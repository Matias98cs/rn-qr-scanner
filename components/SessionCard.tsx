import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Session } from "@/infrastructure/interfaces/sessions";
import { QrCode } from "@/infrastructure/interfaces/qr";
import { useThemeColor } from "@/hooks/useThemeColor";

interface SessionCardProps {
  session: Session;
  qrCodes: QrCode[];
  handleShare: (session: Session) => void;
  handleSeeMore: (session: Session) => void;
  isEditing: boolean;
  setEditingSessionId: (id: string | null) => void;
  handleEditSessionName: (id: string, name: string) => void;
}

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

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  qrCodes,
  handleShare,
  handleSeeMore,
  isEditing,
  setEditingSessionId,
  handleEditSessionName,
}) => {
  const [input, setInput] = useState<string>(session.name);
  const textColor = useThemeColor({}, "text");
  const colorScheme = useColorScheme();

  const isDark = colorScheme === "dark";
  const iconbackgroundColor = isDark ? "#FFFFFF" : "#252525";
  const iconColor = isDark ? "#252525" : "#FFFFFF";

  return (
    <View
      style={[
        styles.sessionCard,
        {
          backgroundColor: colorScheme === "dark" ? "#252525" : "white",
          borderWidth: colorScheme === "dark" ? 0 : 0.5,
        },
      ]}
    >
      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            style={[
              styles.input,
              {
                borderColor: iconbackgroundColor,
                color: textColor,
              },
            ]}
          />
          <View style={styles.editButtons}>
            <Pressable
              style={[
                styles.editButton,
                { backgroundColor: iconbackgroundColor },
              ]}
              onPress={() => {
                handleEditSessionName(session.id, input);
                setEditingSessionId(null);
              }}
            >
              <Ionicons name="checkmark-outline" size={20} color={iconColor} />
            </Pressable>
            <Pressable
              style={[
                styles.editButton,
                { backgroundColor: iconbackgroundColor },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setEditingSessionId(null);
              }}
            >
              <Ionicons name="close" size={20} color={iconColor} />
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.headerContainer}>
          <Text style={[styles.sessionTitle, { color: textColor }]}>
            {session.name}
          </Text>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setInput(session.name);
              setEditingSessionId(session.id);
            }}
          >
            <Ionicons name="pencil" size={20} color={textColor} />
          </Pressable>
        </View>
      )}
      <Text style={styles.sessionDate}>{formatDate(session.created_at)}</Text>

      {qrCodes && qrCodes.length > 0 ? (
        qrCodes.map((qr) => (
          <View key={qr.id} style={styles.qrItem}>
            <Ionicons name="qr-code-outline" size={24} color={textColor} />
            <Text style={[styles.qrText, { color: textColor }]}>{qr.text}</Text>
          </View>
        ))
      ) : (
        <Text style={[styles.noQrText, { color: textColor }]}>
          No hay códigos en esta sesión
        </Text>
      )}

      <View style={styles.buttonsContainer}>
        <Pressable
          style={styles.iconButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            handleShare(session);
          }}
        >
          <Ionicons name="share-outline" size={24} color={textColor} />
        </Pressable>
        <Pressable
          style={styles.iconButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            handleSeeMore(session);
          }}
        >
          <Ionicons
            name="ellipsis-horizontal-outline"
            size={24}
            color={textColor}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sessionCard: {
    width: "100%",
    padding: 16,
    borderRadius: 15,
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  noQrText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
  },
  iconButton: {
    marginLeft: 15,
    padding: 5,
  },
  editContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    width: "70%",
    borderRadius: 15,
    padding: 8,
  },
  editButtons: {
    flexDirection: "row",
    gap: 10,
    width: "30%",
    justifyContent: "space-evenly",
  },
  editButton: {
    backgroundColor: "black",
    padding: 8,
    borderRadius: 15,
  },
});

export default SessionCard;
