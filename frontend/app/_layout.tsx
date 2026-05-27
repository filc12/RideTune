import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { LanguageProvider } from "@/src/i18n";
import { SplashAnimated } from "@/src/components/SplashAnimated";
import { storage } from "@/src/utils/storage";

SplashScreen.preventAutoHideAsync();
SplashScreen.hideAsync();

const K_ONBOARDED = "ridetune.onboarded";

function AppWithSplash() {
  const router = useRouter();
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashFinish = async () => {
    setSplashDone(true);
    const onboarded = await storage.getItem<string>(K_ONBOARDED, "");
    if (!onboarded) {
      router.replace("/onboarding" as never);
    }
  };

  return (
    <>
      <Stack screenOptions={{ headerShown: false, animation: "slide_from_right", animationDuration: 300, contentStyle: { backgroundColor: "#070A0F" } }} />
      {!splashDone && <SplashAnimated onFinish={handleSplashFinish} />}
    </>
  );
}

export default function RootLayout() {
  return (
    <LanguageProvider>
      <AppWithSplash />
    </LanguageProvider>
  );
}
