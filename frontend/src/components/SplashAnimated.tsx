import React, { useCallback, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

const { width, height } = Dimensions.get("window");

interface Props {
  onFinish: () => void;
}

export function SplashAnimated({ onFinish }: Props) {
  const fadeOut = useRef(new Animated.Value(1)).current;
  const [finished, setFinished] = useState(false);

  const handleFinish = useCallback(() => {
    if (finished) return;
    setFinished(true);
    Animated.timing(fadeOut, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => onFinish());
  }, [finished]);

  const player = useVideoPlayer(
    require("../../assets/video/ridetune_slowfade_endglow.mp4"),
    (p) => {
      p.loop = false;
      p.muted = true;
      p.play();
    }
  );

  player.addListener("playingChange", (event) => {
    if (!event.isPlaying && finished === false) {
      handleFinish();
    }
  });

  return (
    <Animated.View style={[styles.root, { opacity: fadeOut }]}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="contain"
        nativeControls={false}
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
  video: {
    width,
    height,
  },
});
