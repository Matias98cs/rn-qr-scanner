import { SQLiteDatabase } from "expo-sqlite";

export const createDbIfNeeded = async (db: SQLiteDatabase) => {
    // console.log("Creando database...");
    await db.execAsync(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT);"
    );
};

export const DATABASE_NAME = "qr.db";
