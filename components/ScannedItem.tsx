import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface ScannedItemProps {
  data: string;
  onDelete: (item: string) => void;
}

const ScannedItem: React.FC<ScannedItemProps> = ({ data, onDelete }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const textColor = isDark ? "white" : "#252525";
  const borderColor = isDark ? "#555" : "#ccc";

  return (
    <View style={[styles.itemContainer, { borderBottomColor: borderColor }]}>
      <View style={styles.itemContent}>
        <Ionicons name="checkmark-circle" size={24} color={"green"} />
        <Text style={[styles.dataText, { color: textColor }]}>{data}</Text>
      </View>
      <Pressable
        onPressOut={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onDelete(data);
        }}
      >
        <Ionicons name="close-outline" size={24} color={textColor} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  dataText: {
    fontSize: 16,
    marginLeft: 5,
  },
});

export default ScannedItem;
