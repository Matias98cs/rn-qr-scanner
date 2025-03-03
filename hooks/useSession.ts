import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { createSession } from "@/database/qrRepository";

export const useSession = () => {
  const database = useSQLiteContext();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const startNewSession = async () => {
      try {
        const newSessionId = await createSession(
          database,
          `Escaneo ${new Date().toLocaleString()}`
        );
        setSessionId(newSessionId);
      } catch (error) {
        console.error("Error al crear sesión:", error);
      }
    };
    startNewSession();
  }, [database]);

  return sessionId;
};
