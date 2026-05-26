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
      <Stack screenOptions={{ headerShown: false, animation: "slide_from_right", animationDuration: 300, contentStyle: { backgroundColor: "#070A0F" } }} />
      {!splashDone && <SplashAnimated onFinish={() => setSplashDone(true)} />}
    </LanguageProvider>
  );
}
