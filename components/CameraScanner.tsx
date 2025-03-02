import React from "react";
import { StyleSheet } from "react-native";
import { CameraView } from "expo-camera";

interface CameraScannerProps {
  onBarcodeScanned: (data: string) => void;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onBarcodeScanned }) => {
  return (
    <CameraView
      style={StyleSheet.absoluteFillObject}
      facing="back"
      onBarcodeScanned={({ data }) => onBarcodeScanned(data)}
    />
  );
};

export default CameraScanner;