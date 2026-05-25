import React from "react";
import { Stack } from "expo-router";
import { LanguageProvider } from "@/src/i18n";

export default function RootLayout() {
  return (
    <LanguageProvider>
      <Stack screenOptions={{ headerShown: false, animation: "fade", animationDuration: 180, contentStyle: { backgroundColor: "#070A0F" } }} />
    </LanguageProvider>
  );
}
