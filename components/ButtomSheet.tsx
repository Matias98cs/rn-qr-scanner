import React, { useRef } from "react";
import {
  View,
  Text,
  Animated,
  ScrollView,
  StyleSheet,
  PanResponder,
  Pressable,
  useColorScheme,
} from "react-native";
import ScannedItem from "./ScannedItem";
import * as Haptics from "expo-haptics";

const MIN_MODAL_HEIGHT = 200;
const MAX_MODAL_HEIGHT = 700;

interface BottomSheetProps {
  scannedData: string[];
  onDeleteItem: (item: string) => void;
  onSend: () => void;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  scannedData,
  onDeleteItem,
  onSend,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const bottomSheetBackground = isDark
    ? "rgba(0, 0, 0, 0.9)"
    : "rgba(255, 255, 255, 0.9)";
  const dataTextColor = isDark ? "#fff" : "#000";
  const sendButtonColor = isDark ? "white" : "black";
  const sendButtonText = isDark ? "#252525" : "white";

  const modalHeight = useRef(new Animated.Value(MIN_MODAL_HEIGHT)).current;
  const dragStartHeight = useRef(MIN_MODAL_HEIGHT);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 5,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gestureState) => {
        let newHeight = dragStartHeight.current - gestureState.dy;
        newHeight = Math.max(
          MIN_MODAL_HEIGHT,
          Math.min(newHeight, MAX_MODAL_HEIGHT)
        );
        modalHeight.setValue(newHeight);
      },
      onPanResponderRelease: (_, gestureState) => {
        let finalHeight = dragStartHeight.current - gestureState.dy;
        finalHeight =
          finalHeight < MIN_MODAL_HEIGHT + 50 ? MIN_MODAL_HEIGHT : finalHeight;
        finalHeight =
          finalHeight > MAX_MODAL_HEIGHT - 50 ? MAX_MODAL_HEIGHT : finalHeight;

        Animated.timing(modalHeight, {
          toValue: finalHeight,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          dragStartHeight.current = finalHeight;
        });
      },
    })
  ).current;

  return (
    <Animated.View
      pointerEvents="auto"
      style={[
        styles.bottomSheet,
        { height: modalHeight, backgroundColor: bottomSheetBackground },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.handleContainer}>
        <View style={[styles.handle]} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        {scannedData.length > 0 ? (
          scannedData.map((item, index) => (
            <ScannedItem key={index} data={item} onDelete={onDeleteItem} />
          ))
        ) : (
          <Text style={[styles.dataText, { color: dataTextColor }]}>
            Escanea un código
          </Text>
        )}

        {scannedData.length > 0 && (
          <Pressable
            hitSlop={10}
            style={({ pressed }) => [
              styles.sendButton,
              { backgroundColor: sendButtonColor },
            ]}
            onPressOut={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSend();
            }}
          >
            <Text style={[styles.btnText, { color: sendButtonText }]}>
              Aceptar
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
    overflow: "hidden",
  },
  handleContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#ccc",
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  dataText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  sendButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  btnText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default BottomSheet;
