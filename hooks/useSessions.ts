import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { getSessions, getQrCodesBySession } from "@/database/qrRepository";
import { Session } from "@/infrastructure/interfaces/sessions";
import { QrCode } from "@/infrastructure/interfaces/qr";

export const useSessions = () => {
  const database = useSQLiteContext();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [qrCodes, setQrCodes] = useState<Record<string, QrCode[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadSessions = async () => {
      try {
        const data = await getSessions(database);
        if (isMounted) {
          setSessions(data);
        }
        const qrData: Record<string, QrCode[]> = {};
        for (const session of data) {
          const qrCodesForSession = await getQrCodesBySession(database, session.id);
          qrData[session.id] = qrCodesForSession;
        }
        if (isMounted) {
          setQrCodes(qrData);
        }
      } catch (error) {
        console.error("Error al obtener sesiones:", error);
        if (isMounted) {
          setError("Error al obtener sesiones");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSessions();

    return () => {
      isMounted = false;
    };
  }, [database]);

  return { sessions, qrCodes, loading, error };
};
