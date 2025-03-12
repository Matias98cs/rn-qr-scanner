import { create } from "zustand";
import { checkCameraPermissions, requestCameraPermissions } from "@/core/actions/permissions/camera";
import { checkStoragePermissions, requestStoragePermissions } from "@/core/actions/permissions/storage";
import { PermissionsStatus } from "@/infrastructure/interfaces/camera";

interface PermissionsState {
    cameraStatus: PermissionsStatus;
    storageStatus: PermissionsStatus;

    requestCameraPermissions: () => Promise<PermissionsStatus>;
    checkCameraPermissions: () => Promise<PermissionsStatus>;

    requestStoragePermissions: () => Promise<PermissionsStatus>;
    checkStoragePermissions: () => Promise<PermissionsStatus>;
}

export const usePermissionsStore = create<PermissionsState>()((set) => ({
    cameraStatus: PermissionsStatus.CHECKING,
    storageStatus: PermissionsStatus.CHECKING,

    requestCameraPermissions: async () => {
        const status = await requestCameraPermissions();
        set({ cameraStatus: status });
        return status;
    },

    checkCameraPermissions: async () => {
        const status = await checkCameraPermissions();
        set({ cameraStatus: status });
        return status;
    },

    requestStoragePermissions: async () => {
        const status = await requestStoragePermissions();
        set({ storageStatus: status });
        return status;
    },

    checkStoragePermissions: async () => {
        const status = await checkStoragePermissions();
        set({ storageStatus: status });
        return status;
    }
}));
