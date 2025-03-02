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
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        modalHeight.stopAnimation((value: number) => {
          dragStartHeight.current = value;
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        let newHeight = dragStartHeight.current - gestureState.dy;
        newHeight = Math.max(
          MIN_MODAL_HEIGHT,
          Math.min(newHeight, MAX_MODAL_HEIGHT)
        );
        modalHeight.setValue(newHeight);
      },
      onPanResponderRelease: (evt, gestureState) => {
        let finalHeight = dragStartHeight.current - gestureState.dy;
        if (finalHeight < MIN_MODAL_HEIGHT + 50) {
          finalHeight = MIN_MODAL_HEIGHT;
        } else if (finalHeight > MAX_MODAL_HEIGHT - 50) {
          finalHeight = MAX_MODAL_HEIGHT;
        }
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
    <Animated.View style={[styles.bottomSheet, { height: modalHeight }]} {...panResponder.panHandlers}>
      <View style={styles.handleContainer}>
        <View style={styles.handle} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {scannedData.length > 0 ? (
          scannedData.map((item, index) => (
            <ScannedItem key={index} data={item} onDelete={onDeleteItem} />
          ))
        ) : (
          <Text style={styles.dataText}>Escanea un código</Text>
        )}

        {scannedData.length > 0 && (
          <Pressable
            style={({ pressed }) => ({
              backgroundColor: pressed ? "#252525" : "black",
              padding: 10,
              borderRadius: 10,
              marginTop: 20,
            })}
            onPress={onSend}
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
  btnText: {
    color: "white",
    textAlign: "center",
  },
});

export default BottomSheet;
