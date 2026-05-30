import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { ThemeProvider, DarkTheme } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { LanguageProvider } from "@/src/i18n";
import { SplashAnimated } from "@/src/components/SplashAnimated";

SplashScreen.preventAutoHideAsync();
SplashScreen.hideAsync();

const RideTuneTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: "#070A0F" },
};

export default function RootLayout() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <LanguageProvider>
      <View style={rootStyles.bg}>
      <ThemeProvider value={RideTuneTheme}>
        <Stack screenOptions={{
          headerShown: false,
          animation: "fade_from_bottom",
          animationDuration: 250,
          contentStyle: { backgroundColor: "#070A0F" }
        }} />
      </ThemeProvider>
      </View>
      {!splashDone && <SplashAnimated onFinish={() => setSplashDone(true)} />}
    </LanguageProvider>
  );
}

const rootStyles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#070A0F" },
});
