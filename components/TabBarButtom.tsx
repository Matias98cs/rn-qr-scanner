import { icon, TabRoute } from "@/constants/icon";
import React, { useEffect } from "react";
import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface TabBarButtonProps {
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  routeName: TabRoute;
  color: string;
  label: string;
  style?: ViewStyle;
}

const TabBarButton: React.FC<TabBarButtonProps> = ({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  label,
  color,
  style,
}) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 }
    );
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    const top = interpolate(scale.value, [0, 1], [0, 9]);
    return {
      transform: [{ scale: scaleValue }],
      top: top,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);

    return {
      opacity,
    };
  });

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      onLongPress={onLongPress}
      style={[styles.tabbarItem, style]}
    >
      <Animated.View style={[animatedIconStyle, styles.iconContainer]}>
        {icon[routeName]({ color: isFocused ? "#FFF" : "#252525", size: 24 })}
      </Animated.View>
      <Animated.Text
        style={[
          styles.label,
          { color: isFocused ? "#673ab7" : "#252525" },
          animatedTextStyle,
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tabbarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    // marginTop: 4,
  },
});

export default TabBarButton;
