import React from "react";
import { Stack } from "expo-router";
import { LanguageProvider } from "@/src/i18n";

export default function RootLayout() {
  return (
    <LanguageProvider>
      <Stack screenOptions={{ headerShown: false, animation: "slide_from_right", animationDuration: 300, contentStyle: { backgroundColor: "#070A0F" } }} />
    </LanguageProvider>
  );
}
