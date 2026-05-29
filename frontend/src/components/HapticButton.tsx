import React from "react";
import { GestureResponderEvent, Pressable, PressableProps } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from "react-native-reanimated";
import { tapLight, tapMedium, tapSuccess, tapWarning } from "@/src/utils/haptics";

export type HapticKind = "light" | "medium" | "success" | "warning" | "none";

const FIRE: Record<HapticKind, () => void> = {
  light: tapLight,
  medium: tapMedium,
  success: tapSuccess,
  warning: tapWarning,
  none: () => {},
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// activeOpacity is accepted for backwards-compat with old TouchableOpacity call
// sites but is intentionally unused — the press feedback is now a scale animation.
export function HapticButton({
  haptic = "light",
  onPress,
  onPressIn,
  onPressOut,
  style,
  disabled,
  activeOpacity: _activeOpacity,
  ...rest
}: PressableProps & { haptic?: HapticKind; activeOpacity?: number }) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      style={[style as never, animStyle]}
      onPressIn={(e: GestureResponderEvent) => {
        if (!disabled) {
          scale.value = withTiming(0.97, { duration: 90 });
          FIRE[haptic]();
        }
        onPressIn?.(e);
      }}
      onPressOut={(e: GestureResponderEvent) => {
        scale.value = withSpring(1, { damping: 15, stiffness: 220 });
        onPressOut?.(e);
      }}
      onPress={(e: GestureResponderEvent) => {
        onPress?.(e);
      }}
    />
  );
}
