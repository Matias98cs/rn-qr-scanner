import { QrCode } from "@/infrastructure/interfaces/qr";
import { SQLiteDatabase } from "expo-sqlite";
import uuid from "react-native-uuid";


// ✅ Crear una nueva sesión
export const createSession = async (database: SQLiteDatabase, name: string) => {
    const sessionId = uuid.v4() as string; // ✅ Asegurar que el UUID es un string
    try {
        await database.runAsync(
            "INSERT INTO sessions (id, name) VALUES (?, ?);",
            [sessionId, name]
        );
        return sessionId;
    } catch (error) {
        console.error("Error creando sesión:", error);
        throw error;
    }
};

// ✅ Guardar un código QR en una sesión específica
export const saveQrCode = async (database: SQLiteDatabase, sessionId: string, text: string, url: string | null) => {
    try {
        await database.runAsync(
            "INSERT INTO qr_codes (session_id, text, url) VALUES (?, ?, ?);",
            [sessionId, text, url]
        );
    } catch (error) {
        console.error("Error guardando código QR:", error);
        throw error;
    }
};

// ✅ Obtener todas las sesiones
export const getSessions = async (database: SQLiteDatabase) => {
    try {
        const results = await database.getAllAsync<{
            id: string;
            name: string;
            created_at: string;
        }>("SELECT * FROM sessions ORDER BY created_at DESC;");
        return results;
    } catch (error) {
        console.error("Error obteniendo sesiones:", error);
        throw error;
    }
};

// ✅ Obtener todos los códigos QR de una sesión específica
export const getQrCodesBySession = async (database: SQLiteDatabase, sessionId: string) => {
    try {
        const results = await database.getAllAsync<QrCode>(
            "SELECT id, text, url, created_at, session_id FROM qr_codes WHERE session_id = ? ORDER BY created_at DESC;",
            [sessionId]
        );

        return results;
    } catch (error) {
        console.error("Error obteniendo códigos QR por sesión:", error);
        throw error;
    }
};

// ✅ Eliminar una sesión y todos sus códigos QR
export const deleteSession = async (database: SQLiteDatabase, sessionId: string) => {
    try {
        await database.runAsync("DELETE FROM sessions WHERE id = ?;", [sessionId]);
    } catch (error) {
        console.error("Error eliminando sesión:", error);
        throw error;
    }
};


export const editNameSession = async (database: SQLiteDatabase, sessionId: string, newName: string) => {
    try {
        const results = `
        UPDATE sessions
        SET name = ?
        WHERE id = ?;
        `

        const resultados = await database.runAsync(
            results,
            [newName, sessionId]
        )
        return resultados
    } catch (error) {
        console.error("Error editando nombre de sesión:", error);
        throw error;
    }
}