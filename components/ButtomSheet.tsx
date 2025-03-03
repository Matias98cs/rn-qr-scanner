import React, { useRef } from "react";
import {
  View,
  Text,
  Animated,
  ScrollView,
  StyleSheet,
  PanResponder,
  Pressable,
} from "react-native";
import ScannedItem from "./ScannedItem";

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
  const modalHeight = useRef(new Animated.Value(MIN_MODAL_HEIGHT)).current;
  const dragStartHeight = useRef(MIN_MODAL_HEIGHT);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (evt, gestureState) => {
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
      style={[styles.bottomSheet, { height: modalHeight }]}
      {...panResponder.panHandlers}
    >
      <View style={styles.handleContainer}>
        <View style={styles.handle} />
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
          <Text style={styles.dataText}>Escanea un código</Text>
        )}

        {scannedData.length > 0 && (
          <Pressable
            hitSlop={10}
            style={({ pressed }) => [
              styles.sendButton,
              { backgroundColor: pressed ? "#252525" : "black" },
            ]}
            // onPress={() => console.log("Hola")} // ✅ Ya debería responder bien
            onPressOut={onSend}
          >
            <Text style={styles.btnText}>Enviar</Text>
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
    backgroundColor: "rgba(255,255,255,0.9)",
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
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default BottomSheet;
