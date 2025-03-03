import React from "react";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useThemeColor } from "@/hooks/useThemeColor";

interface QRButtonProps {
  onPress: () => void;
  isPermissionGranted: boolean;
}

export const QRButton: React.FC<QRButtonProps> = ({
  onPress,
  isPermissionGranted,
}) => {
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, "text");
  const iconThemeColor = useThemeColor({}, "icon");
  const iconColor = isPermissionGranted
    ? iconThemeColor
    : colorScheme === "dark"
    ? "rgba(255, 255, 255, 0.6)"
    : "rgba(0, 0, 0, 0.5)";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.qrButtonContainer,
        {
          backgroundColor: colorScheme === "dark" ? "white" : "#252525",
          shadowColor: textColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
          opacity: !isPermissionGranted ? 0.5 : 1,
        },
      ]}
    >
      <Ionicons name="qr-code-outline" size={35} color={iconColor} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  qrButtonContainer: {
    position: "absolute",
    bottom: 130,
    alignSelf: "center",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
