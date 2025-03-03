import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { PermissionsStatus } from "@/infrastructure/interfaces/camera"
import { Camera } from "expo-camera"
import { Alert, Linking } from 'react-native';

export const requestCameraPermissions = async (): Promise<PermissionsStatus> => {
    const { status } = await Camera.requestCameraPermissionsAsync();

    if (status !== 'granted') {
        if (status === 'denied') {
            manualPermissionsRequest();
        }
        return PermissionsStatus.DENIED;
    }

    return PermissionsStatus.GRANTED;
}

export const checkCameraPermissions = async (): Promise<PermissionsStatus> => {
    const { status } = await Camera.getCameraPermissionsAsync();

    switch (status) {
        case 'granted':
            return PermissionsStatus.GRANTED;
        case 'denied':
            return PermissionsStatus.DENIED;
        default:
            return PermissionsStatus.UNDERTERMINED;
    }
}

export const manualPermissionsRequest = async () => {
    Alert.alert(
        'Permisos de cámara',
        'Para poder escanear códigos QR necesitamos permisos de cámara',
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
    )
}

