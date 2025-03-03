import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { getSessions, getQrCodesBySession } from "@/database/qrRepository";
import { Session } from "@/infrastructure/interfaces/sessions";
import { QrCode } from "@/infrastructure/interfaces/qr";

export const useSessions = () => {
  const database = useSQLiteContext();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [qrCodes, setQrCodes] = useState<Record<string, QrCode[]>>({});

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await getSessions(database);
        setSessions(data);

        const qrData: Record<string, QrCode[]> = {};
        for (const session of data) {
          const qrCodesForSession = await getQrCodesBySession(database, session.id);
          qrData[session.id] = qrCodesForSession;
        }
        setQrCodes(qrData);
      } catch (error) {
        console.error("Error al obtener sesiones:", error);
      }
    };

    loadSessions();
  }, [database]);

  return { sessions, qrCodes };
};
