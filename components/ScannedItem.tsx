import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface ScannedItemProps {
  data: string;
  onDelete: (item: string) => void;
}

const ScannedItem: React.FC<ScannedItemProps> = ({ data, onDelete }) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Ionicons name="checkmark-circle" size={24} color="green" />
        <Text style={styles.dataText}>{data}</Text>
      </View>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onDelete(data);
        }}
      >
        <Ionicons name="close-outline" size={24} color="black" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "#ccc",
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
