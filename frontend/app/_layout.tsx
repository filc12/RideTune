import React, { useEffect, useState } from "react";
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
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    storage.getItem<string>(K_ONBOARDED, "").then((val) => {
      setOnboarded(!!val);
    });
  }, []);

  const handleSplashFinish = () => {
    setSplashDone(true);
    if (onboarded === false) {
      router.replace("/onboarding" as never);
    }
  };

  if (onboarded === null) return null;

  return (
    <>
      <Stack screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 300,
        contentStyle: { backgroundColor: "#070A0F" }
      }} />
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
