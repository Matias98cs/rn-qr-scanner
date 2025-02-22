import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  AppState,
  Platform,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  PanResponder,
  Dimensions,
  Animated,
  Pressable,
} from "react-native";
import { CameraView } from "expo-camera";
import { Stack, useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MIN_MODAL_HEIGHT = 200;
const MAX_MODAL_HEIGHT = SCREEN_HEIGHT - 100;

export default function Home() {
  const router = useRouter();
  const navigation = useNavigation();
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [scannedData, setScannedData] = useState<string[]>([]);

  const modalHeight = useRef(new Animated.Value(MIN_MODAL_HEIGHT)).current;
  const dragStartHeight = useRef(MIN_MODAL_HEIGHT);

  useEffect(() => {
    navigation.setOptions({
      title: "Lector QR",
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: "black",
      },
      headerLeft: () => (
        <Pressable
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons
            name="arrow-back-outline"
            color="white"
            size={24}
            style={{ marginRight: 10 }}
          />
        </Pressable>
      ),
    });
  }, [navigation, router]);

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

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (data && !qrLock.current && !scannedData.includes(data)) {
      qrLock.current = true;
      setScannedData((prev) => [...prev, data]);
      setTimeout(() => {
        qrLock.current = false;
      }, 500);
    }
  };

  const handleDeleteItem = (itemToDelete: string) => {
    setScannedData((prev) => prev.filter((item) => item !== itemToDelete));
  };

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
          Math.min(newHeight, MAX_MODAL_HEIGHT),
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
    }),
  ).current;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={handleBarcodeScanned}
        />
      </View>

      <Animated.View
        style={[styles.bottomSheet, { height: modalHeight }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {scannedData.length > 0 ? (
            scannedData.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <View style={styles.itemContent}>
                  <Ionicons name="checkmark-circle" size={24} color="green" />
                  <Text style={styles.dataText}>{item}</Text>
                </View>
                <Pressable onPress={() => handleDeleteItem(item)}>
                  <Ionicons name="close-outline" size={24} color="black" />
                </Pressable>
              </View>
            ))
          ) : (
            <Text style={styles.dataText}>
              Escanea un código para mostrar la data
            </Text>
          )}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    position: "relative",
  },
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
    marginBottom: 4,
    marginLeft: 5,
  },
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
});
