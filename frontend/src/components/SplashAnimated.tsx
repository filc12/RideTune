import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle, Defs, G, Line, LinearGradient, Path, Rect, Stop,
} from "react-native-svg";

const { width, height } = Dimensions.get("window");
const SIZE = Math.min(width, height) * 0.65;

interface Props {
  onFinish: () => void;
}

export function SplashAnimated({ onFinish }: Props) {
  const opacity  = useRef(new Animated.Value(0)).current;
  const scale    = useRef(new Animated.Value(0.82)).current;
  const fadeOut  = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Fade + scale in
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 7, tension: 35, useNativeDriver: true }),
      ]),
      // Glow pulse suave
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]),
        { iterations: 2 }
      ),
      Animated.delay(200),
      // Fade out
      Animated.timing(fadeOut, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start(() => onFinish());
  }, []);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.75, 1],
  });

  return (
    <Animated.View style={[styles.root, { opacity: fadeOut }]}>
      <Animated.View style={{ opacity, transform: [{ scale }], alignItems: "center" }}>
        <Animated.View style={{ opacity: glowOpacity }}>
          <Svg width={SIZE} height={SIZE * 0.62} viewBox="90 105 450 340">
            <Defs>
              <LinearGradient id="shock-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#00f3ff" />
                <Stop offset="100%" stopColor="#39ff14" />
              </LinearGradient>
            </Defs>

            {/* R */}
            <Path
              d="M 125,120 L 125,320 M 125,125 L 245,125 A 65,65 0 0,1 310,190 A 65,65 0 0,1 245,255 L 125,255 M 220,255 L 320,320"
              fill="none" stroke="#00f3ff" strokeWidth="18"
              strokeLinecap="round" strokeLinejoin="round"
            />
            {/* T */}
            <Path
              d="M 285,125 L 485,125 M 385,125 L 385,320"
              fill="none" stroke="#39ff14" strokeWidth="18"
              strokeLinecap="round" strokeLinejoin="round"
            />
            {/* Amortecedor */}
            <G transform="translate(300, 260) rotate(-35) translate(-100, -200)">
              <Circle cx="100" cy="80" r="16" fill="none" stroke="url(#shock-grad)" strokeWidth="8" />
              <Line x1="100" y1="96" x2="100" y2="120" stroke="url(#shock-grad)" strokeWidth="10" strokeLinecap="round" />
              <Rect x="80" y="120" width="40" height="30" rx="5" fill="none" stroke="url(#shock-grad)" strokeWidth="8" />
              <Path
                d="M 80,150 C 60,165 140,175 120,190 C 60,205 140,215 120,230 C 60,245 140,255 120,270 C 60,285 140,295 120,310 C 60,325 140,335 120,350"
                fill="none" stroke="url(#shock-grad)" strokeWidth="12"
                strokeLinecap="round" strokeLinejoin="round"
              />
              <Line x1="100" y1="150" x2="100" y2="350" stroke="url(#shock-grad)" strokeWidth="6" opacity="0.6" />
              <Rect x="80" y="350" width="40" height="20" rx="3" fill="none" stroke="url(#shock-grad)" strokeWidth="8" />
              <Line x1="100" y1="370" x2="100" y2="395" stroke="url(#shock-grad)" strokeWidth="10" strokeLinecap="round" />
              <Circle cx="100" cy="410" r="16" fill="none" stroke="url(#shock-grad)" strokeWidth="8" />
            </G>
          </Svg>
        </Animated.View>

        <Animated.Text style={[styles.wordmark, { opacity: glowOpacity }]}>
          <Text style={styles.ride}>Ride</Text>
          <Text style={styles.tune}>Tune</Text>
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#080c10",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  wordmark: {
    marginTop: 16,
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: 1,
  },
  ride: { color: "#00f3ff" },
  tune: { color: "#39ff14" },
});
