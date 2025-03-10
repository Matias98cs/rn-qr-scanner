import { PermissionsStatus } from "@/infrastructure/interfaces/camera";
import * as MediaLibrary from "expo-media-library";
import { Alert, Linking } from "react-native";

export const requestStoragePermissions = async (): Promise<PermissionsStatus> => {
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== "granted") {
        if (status === "denied") {
            manualPermissionsRequest();
        }
        return PermissionsStatus.DENIED;
    }

    return PermissionsStatus.GRANTED;
};

export const checkStoragePermissions = async (): Promise<PermissionsStatus> => {
    const { status } = await MediaLibrary.getPermissionsAsync();

    switch (status) {
        case "granted":
            return PermissionsStatus.GRANTED;
        case "denied":
            return PermissionsStatus.DENIED;
        default:
            return PermissionsStatus.UNDERTERMINED;
    }
};

export const manualPermissionsRequest = async () => {
    Alert.alert(
        "Permisos de almacenamiento",
        "Para guardar imágenes en tu galería necesitamos permisos de almacenamiento.",
        [
            {
                text: "Ir a ajustes",
                onPress: () => {
                    Linking.openSettings();
                }
            },
            {
                text: "Cancelar",
                style: "destructive"
            }
        ]
    );
};
