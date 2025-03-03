import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Session } from "@/infrastructure/interfaces/sessions";
import { QrCode } from "@/infrastructure/interfaces/qr";
import { useThemeColor } from "@/hooks/useThemeColor";

interface SessionCardProps {
  session: Session;
  qrCodes: QrCode[];
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
}) => {
  const textColor = useThemeColor({}, "text");

  return (
    <View style={styles.sessionCard}>
      <Text style={[styles.sessionTitle, { color: textColor }]}>
        {session.name}
      </Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
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
  noQrText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
});
