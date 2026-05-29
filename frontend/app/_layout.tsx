import React, { useState } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { LanguageProvider } from "@/src/i18n";
import { SplashAnimated } from "@/src/components/SplashAnimated";

SplashScreen.preventAutoHideAsync();
SplashScreen.hideAsync();

export default function RootLayout() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <LanguageProvider>
      <Stack screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
        animationDuration: 350,
        contentStyle: { backgroundColor: "#070A0F" }
      }} />
      {!splashDone && <SplashAnimated onFinish={() => setSplashDone(true)} />}
    </LanguageProvider>
  );
}
