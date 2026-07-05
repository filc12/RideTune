import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { ThemeProvider, DarkTheme } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { LanguageProvider } from "@/src/i18n";
import { SplashAnimated } from "@/src/components/SplashAnimated";
import * as Sentry from '@sentry/react-native';
import { initOemData } from "@/src/services/oem-data";
import { initAnalytics } from "@/src/services/analytics";
import { initPurchases } from "@/src/services/purchases";

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN ?? "",
  enabled: !__DEV__,
  sendDefaultPii: false,
  enableLogs: true,
  tracesSampleRate: 0.2,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],
});

SplashScreen.preventAutoHideAsync();
SplashScreen.hideAsync();

// Seed dados OEM: começa com bundle, actualiza do Supabase em background
initOemData().catch(() => {/* falha silenciosa — bundle é o fallback */});

// Analytics — inicializar antes de qualquer ecrã
initAnalytics();

// Compras in-app (RevenueCat) — sincroniza entitlement premium em background
initPurchases();

const RideTuneTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: "#070A0F" },
};

function RootLayout() {
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

// Sentry.wrap captura crashes não tratados e envia para o dashboard
export default Sentry.wrap(RootLayout);

const rootStyles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#070A0F" },
});
