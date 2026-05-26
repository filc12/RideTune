import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import Svg, {
  Circle, Defs, Filter, FeMerge, FeMergeNode, FeGaussianBlur,
  G, Line, LinearGradient, Path, Rect, Stop,
} from "react-native-svg";

const { width, height } = Dimensions.get("window");
const SIZE = Math.min(width, height) * 0.72;

interface Props {
  onFinish: () => void;
}

export function SplashAnimated({ onFinish }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale   = useRef(new Animated.Value(0.88)).current;
  const glow    = useRef(new Animated.Value(0.3)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // 1. Fade + scale in
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
      ]),
      // 2. Glow pulse x2
      Animated.sequence([
        Animated.timing(glow, { toValue: 1,   duration: 350, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0.3, duration: 350, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 1,   duration: 350, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0.6, duration: 300, useNativeDriver: true }),
      ]),
      // 3. Hold
      Animated.delay(300),
      // 4. Fade out
      Animated.timing(fadeOut, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => onFinish());
  }, []);

  return (
    <Animated.View style={[styles.root, { opacity: fadeOut }]}>
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <Animated.View style={{ opacity: glow }}>
          <Svg width={SIZE} height={SIZE} viewBox="0 0 800 800">
            <Defs>
              <LinearGradient id="shock-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#00f3ff" />
                <Stop offset="100%" stopColor="#39ff14" />
              </LinearGradient>
              <LinearGradient id="ride-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#00f3ff" />
                <Stop offset="100%" stopColor="#1ee2bd" />
              </LinearGradient>
              <LinearGradient id="tune-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#1ee2bd" />
                <Stop offset="100%" stopColor="#39ff14" />
              </LinearGradient>
            </Defs>

            <Rect width="800" height="800" fill="#080c10" />

            {/* RT + Amortecedor */}
            <G transform="translate(150, 120)">
              {/* R */}
              <Path
                d="M 125,120 L 125,320 M 125,125 L 245,125 A 65,65 0 0,1 310,190 A 65,65 0 0,1 245,255 L 125,255"
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
            </G>

            {/* RideTune */}
            <G transform="translate(100, 560)">
              <Path d="M 40,110 L 40,30 M 40,30 L 90,30 A 25,25 0 0,1 115,55 A 25,25 0 0,1 90,80 L 40,80 M 80,80 L 115,110" fill="none" stroke="url(#ride-grad)" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M 145,55 L 145,110 M 145,30 L 145,35" fill="none" stroke="url(#ride-grad)" strokeWidth="15" strokeLinecap="round" />
              <Path d="M 235,110 L 235,30 M 235,55 A 27,27 0 0,0 180,82 A 27,27 0 0,0 235,110" fill="none" stroke="url(#ride-grad)" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M 315,82 L 265,82 A 27,27 0 0,1 292,55 A 27,27 0 0,1 318,80 A 27,27 0 0,1 265,108" fill="none" stroke="url(#ride-grad)" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M 345,40 L 415,40 M 380,40 L 380,110" fill="none" stroke="url(#tune-grad)" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M 440,55 L 440,100 A 10,10 0 0,0 450,110 L 475,110 L 475,55" fill="none" stroke="url(#tune-grad)" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M 505,110 L 505,55 M 505,65 A 20,20 0 0,1 545,65 L 545,110" fill="none" stroke="url(#tune-grad)" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M 610,82 L 560,82 A 27,27 0 0,1 587,55 A 27,27 0 0,1 613,80 A 27,27 0 0,1 560,108" fill="none" stroke="url(#tune-grad)" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
            </G>
          </Svg>
        </Animated.View>
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
});
