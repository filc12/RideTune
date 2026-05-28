import React from "react";
import { GestureResponderEvent, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { tapLight, tapMedium, tapSuccess, tapWarning } from "@/src/utils/haptics";

export type HapticKind = "light" | "medium" | "success" | "warning" | "none";

const FIRE: Record<HapticKind, () => void> = {
  light: tapLight,
  medium: tapMedium,
  success: tapSuccess,
  warning: tapWarning,
  none: () => {},
};

export function HapticButton({
  haptic = "light",
  onPress,
  ...rest
}: TouchableOpacityProps & { haptic?: HapticKind }) {
  return (
    <TouchableOpacity
      {...rest}
      onPress={(e: GestureResponderEvent) => {
        FIRE[haptic]();
        onPress?.(e);
      }}
    />
  );
}
