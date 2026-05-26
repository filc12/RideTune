import React, { useEffect, useRef } from "react";
import {
  Animated, Dimensions, Easing, Image,
  StyleSheet, View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface Props {
  onFinish: () => void;
}

export function SplashAnimated({ onFinish }: Props) {
  const reveal   = useRef(new Animated.Value(0)).current;
  const fadeOut  = useRef(new Animated.Value(1)).current;
  const bgOpacity = useRef(new Animated.Value(0)).current;

  // Logo dimensions mantendo aspect ratio
  const logoW = width * 0.82;
  const logoH = logoW * (921 / 1707);

  useEffect(() => {
    Animated.sequence([
      // Fundo aparece
      Animated.timing(bgOpacity, {
        toValue: 1, duration: 200, useNativeDriver: true,
      }),
      // Reveal da esquerda para a direita — efeito conta-rotações
      Animated.timing(reveal, {
        toValue: 1,
        duration: 1400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false,
      }),
      // Pausa
      Animated.delay(600),
      // Fade out
      Animated.timing(fadeOut, {
        toValue: 0, duration: 500, useNativeDriver: true,
      }),
    ]).start(() => onFinish());
  }, []);

  const clipWidth = reveal.interpolate({
    inputRange: [0, 1],
    outputRange: [0, logoW],
  });

  return (
    <Animated.View style={[styles.root, { opacity: fadeOut }]}>
      <Animated.View style={{ opacity: bgOpacity, alignItems: "center", justifyContent: "center", flex: 1 }}>
        <View style={{ width: logoW, height: logoH, overflow: "hidden" }}>
          {/* Imagem completa por baixo — muito escura */}
          <Image
            source={require("../../assets/images/splash_logo.png")}
            style={[styles.logo, { width: logoW, height: logoH, opacity: 0.08 }]}
            resizeMode="contain"
          />
          {/* Clip animado da esquerda para a direita */}
          <Animated.View style={[styles.clipMask, { width: clipWidth }]}>
            <Image
              source={require("../../assets/images/splash_logo.png")}
              style={[styles.logo, { width: logoW, height: logoH }]}
              resizeMode="contain"
            />
          </Animated.View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#080c10",
    zIndex: 999,
  },
  logo: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  clipMask: {
    position: "absolute",
    top: 0,
    left: 0,
    overflow: "hidden",
    height: "100%",
  },
});
