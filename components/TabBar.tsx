import React, { useEffect, useState } from "react";
import { View, StyleSheet, LayoutChangeEvent, Dimensions } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { TabRoute } from "@/constants/icon";
import TabBarButton from "./TabBarButtom";

export const TabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const screenWidth = Dimensions.get("window").width;

  const [dimensions, setDimensions] = useState({
    width: screenWidth - 40,
    height: 60,
  });

  const buttonWidth = dimensions.width / state.routes.length;

  const tabPositionX = useSharedValue(buttonWidth * state.index);

  useEffect(() => {
    tabPositionX.value = withSpring(buttonWidth * state.index, {
      damping: 10,
      stiffness: 100,
    });
  }, [state.index, buttonWidth]);

  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  const handleTabPress = (
    route: (typeof state.routes)[number],
    index: number,
    isFocused: boolean
  ) => {
    return () => {
      if (!isFocused) {
        tabPositionX.value = withSpring(buttonWidth * index, {
          damping: 10,
          stiffness: 100,
        });
        navigation.navigate(route.name);
      }
    };
  };

  const handleTabLongPress = (route: (typeof state.routes)[number]) => {
    return () => {
      navigation.emit({
        type: "tabLongPress",
        target: route.key,
      });
    };
  };

  return (
    <View onLayout={onTabbarLayout} style={styles.tabbar}>
      <Animated.View
        style={[
          styles.animatedBackground,
          useAnimatedStyle(() => ({
            transform: [{ translateX: tabPositionX.value }],
          })),
          { width: buttonWidth - 10 },
        ]}
      />

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        return (
          <TabBarButton
            key={route.key}
            onPress={handleTabPress(route, index, isFocused)}
            onLongPress={handleTabLongPress(route)}
            isFocused={isFocused}
            routeName={route.name as TabRoute}
            color={isFocused ? "#FFF" : "#222"}
            label={String(label)}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 35,
    paddingVertical: 15,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    shadowOpacity: 0.3,
    elevation: 5,
  },
  animatedBackground: {
    position: "absolute",
    backgroundColor: "#252525",
    borderRadius: 30,
    height: 60,
    left: 5,
  },
});
