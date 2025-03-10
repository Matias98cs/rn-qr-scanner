import axios from "axios";
import { Platform } from "react-native";

const STAGE = process.env.EXPO_PUBLIC_STAGE || "dev";

const API_URL =
    STAGE === "prod"
        ? process.env.EXPO_PUBLIC_API_URL
        : Platform.OS === "ios"
            ? process.env.EXPO_PUBLIC_API_URL_IOS
            : process.env.EXPO_PUBLIC_API_URL_ANDROID;

if (!API_URL) {
    console.warn("⚠️ API_URL no está configurada. Verifica tu .env");
}

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    async (config) => {
        // config.headers.Authorization = `Bearer ${token}`
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export { api };
