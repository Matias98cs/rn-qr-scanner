import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

interface LoadingScreenProps {
  visible?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ visible = true }) => {
  if (!visible) return null;
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#252525" />
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
  },
});
