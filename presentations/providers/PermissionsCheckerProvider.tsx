import { PropsWithChildren, useEffect } from "react";
import { usePermissionnsStore } from "../store/usePermissions";
import { PermissionsStatus } from "@/infrastructure/interfaces/camera";
import { router } from "expo-router";
import { AppState } from "react-native";

const PermissionsCheckerProvider = ({ children }: PropsWithChildren) => {
  const { cameraStatus, checkCameraPermissions } = usePermissionnsStore();

  //   useEffect(() => {
  //     if (cameraStatus === PermissionsStatus.CHECKING) {
  //       router.replace("/(tabs)/configuration");
  //     }
  //     //  else if (cameraStatus === PermissionsStatus.CHECKING) {
  //     //   router.replace("/(tabs)/configuration");
  //     // }
  //   }, [cameraStatus]);

  useEffect(() => {
    const verifyPermissions = async () => {
      try {
        await checkCameraPermissions();
      } catch (error) {
        console.error("Error verificando permisos de cámara:", error);
      }
    };

    verifyPermissions();
  }, []);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        checkCameraPermissions();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return <>{children}</>;
};

export default PermissionsCheckerProvider;
