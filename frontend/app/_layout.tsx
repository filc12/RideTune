import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { LanguageProvider } from "@/src/i18n";
import { SplashAnimated } from "@/src/components/SplashAnimated";
import { OnboardingModal } from "@/src/components/OnboardingModal";
import { storage } from "@/src/utils/storage";

SplashScreen.preventAutoHideAsync();
SplashScreen.hideAsync();

const K_ONBOARDED = "ridetune.onboarded";

export default function RootLayout() {
  const [splashDone, setSplashDone] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const onboarded = await storage.getItem<string>(K_ONBOARDED, "");
      if (!onboarded) setShowOnboarding(true);
      setReady(true);
    })();
  }, []);

  const handleOnboardingFinish = async () => {
    await storage.setItem(K_ONBOARDED, "true");
    setShowOnboarding(false);
  };

  if (!ready) return null;

  return (
    <LanguageProvider>
      <Stack screenOptions={{ headerShown: false, animation: "slide_from_right", animationDuration: 300, contentStyle: { backgroundColor: "#070A0F" } }} />
      {!splashDone && <SplashAnimated onFinish={() => setSplashDone(true)} />}
      {splashDone && (
        <OnboardingModal
          visible={showOnboarding}
          onFinish={handleOnboardingFinish}
        />
      )}
    </LanguageProvider>
  );
}
