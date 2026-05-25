import React, { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { LanguageProvider } from "@/src/i18n";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LanguageProvider>
      <Stack screenOptions={{ headerShown: false, animation: "slide_from_right", animationDuration: 300, contentStyle: { backgroundColor: "#070A0F" } }} />
    </LanguageProvider>
  );
}
