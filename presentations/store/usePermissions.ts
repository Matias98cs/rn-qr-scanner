import { checkCameraPermissions, requestCameraPermissions } from "@/core/actions/permissions/camera";
import { PermissionsStatus } from "@/infrastructure/interfaces/camera";
import { create } from "zustand";

interface PermissionsState {
    cameraStatus: PermissionsStatus;

    requestCameraPermissions: () => Promise<PermissionsStatus>;
    checkCameraPermissions: () => Promise<PermissionsStatus>;
}

export const usePermissionnsStore = create<PermissionsState>()((set) => ({
    cameraStatus: PermissionsStatus.CHECKING,

    requestCameraPermissions: async () => {
        const status = await requestCameraPermissions();
        set({ cameraStatus: status });
        return status;
    },

    checkCameraPermissions: async () => {
        const status = await checkCameraPermissions();
        set({ cameraStatus: status });
        return status;
    }
}))