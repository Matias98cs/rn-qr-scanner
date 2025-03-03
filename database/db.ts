import { SQLiteDatabase } from "expo-sqlite";

export const DATABASE_NAME = "qr_scanner.db";

export const createDbIfNeeded = async (db: SQLiteDatabase) => {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS qr_codes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          session_id TEXT NOT NULL,
          text TEXT NOT NULL,
          url TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
        );
      `);

    console.log("Tablas 'sessions' y 'qr_codes' creadas o ya existentes.");

};
