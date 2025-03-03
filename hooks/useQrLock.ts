import { useEffect, useRef } from "react";
import { AppState } from "react-native";

export const useQrLock = () => {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, []);

  const lock = () => {
    qrLock.current = true;
  };

  const unlock = () => {
    qrLock.current = false;
  };

  const isLocked = () => qrLock.current;

  return { lock, unlock, isLocked };
};
