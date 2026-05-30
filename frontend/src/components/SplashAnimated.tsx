import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");
const ICON_SIZE = Math.min(width * 0.45, 200);

interface Props {
  onFinish: () => void;
}

export function SplashAnimated({ onFinish }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const rootFade = useRef(new Animated.Value(1)).current;
  const [finished, setFinished] = useState(false);

  const handleFinish = useCallback(() => {
    if (finished) return;
    setFinished(true);
    Animated.timing(rootFade, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => onFinish());
  }, [finished]);

  useEffect(() => {
    // Entrada: fade-in + scale suave até 1
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Fecha ao fim de ~2s (independente de qualquer evento externo)
    const timer = setTimeout(handleFinish, 4000);
    return () => clearTimeout(timer);
  }, [handleFinish]);

  return (
    <Animated.View style={[styles.root, { opacity: rootFade }]}>
      <Animated.Image
        source={require("../../assets/images/icon.png")}
        style={[styles.icon, { opacity, transform: [{ scale }] }]}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#05070A",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
});
