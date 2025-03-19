import { getQrCodesBySession } from "@/database/qrRepository";
import { QrCode } from "@/infrastructure/interfaces/qr";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";

export const useSessionById = (sessionId: string) => {
    const database = useSQLiteContext();
    const [qrCodes, setQrCodes] = useState<QrCode[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadSessionById = async () => {
        setLoading(true)
        try {
            const sessionData = await getQrCodesBySession(database, sessionId);
            setQrCodes(sessionData)
            setError(null);
        } catch (error) {
            console.error("Error al obtener sesión:", error);
            setError("Error al obtener sesiones");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSessionById();
    }, [database, sessionId]);


    return {
        qrCodes,
        loading,
        error,
        loadSessionById,
        refetch: loadSessionById
    }
}