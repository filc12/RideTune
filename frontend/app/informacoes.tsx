import React, { useState } from "react";
import { LayoutAnimation, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, UIManager, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { C, ScreenHeader } from "@/src/components/ScreenHeader";
import { useT } from "@/src/i18n";
import { BottomNav } from "@/src/components/BottomNav";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type SectionKey = "about" | "terms" | "privacy" | "legal";
const SECTIONS: { key: SectionKey; tKey: string; bodyKey: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { key: "about", tKey: "info.about", bodyKey: "info.about.body", icon: "information-outline" },
  { key: "terms", tKey: "info.terms", bodyKey: "info.terms.body", icon: "file-document-outline" },
  { key: "privacy", tKey: "info.privacy", bodyKey: "info.privacy.body", icon: "shield-lock-outline" },
  { key: "legal", tKey: "info.legal", bodyKey: "info.legal.body", icon: "gavel" },
];

export default function InfoScreen() {
  const { t } = useT();
  const [open, setOpen] = useState<SectionKey | null>("about");

  const toggle = (k: SectionKey) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((cur) => (cur === k ? null : k));
  };

  return (
    <View style={st.root} testID="info-screen">
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0B1220", "#070A0F"]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScreenHeader title={t("info.title")} />
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120, maxWidth: 600, alignSelf: "center", width: "100%" }}>
          <View style={st.brand}>
            <View style={st.brandLogo}>
              <View style={st.logoBar} />
              <Text style={st.logoText}>Ride<Text style={{ color: C.accent }}>Tune</Text></Text>
            </View>
            <Text style={st.brandSub}>v1.0.0 · Suspension setup advisor</Text>
          </View>

          <View style={{ gap: 10 }}>
            {SECTIONS.map((s) => {
              const isOpen = open === s.key;
              return (
                <View key={s.key} style={st.card} testID={`section-${s.key}`}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={st.head}
                    onPress={() => toggle(s.key)}
                    testID={`section-toggle-${s.key}`}
                  >
                    <View style={st.iconBox}>
                      <MaterialCommunityIcons name={s.icon} size={18} color={C.accent} />
                    </View>
                    <Text style={st.title}>{t(s.tKey as never)}</Text>
                    <Ionicons
                      name={isOpen ? "chevron-up" : "chevron-down"}
                      size={18}
                      color={C.textDim}
                    />
                  </TouchableOpacity>
                  {isOpen && (
                    <View style={st.body}>
                      <Text style={st.bodyText}>{t(s.bodyKey as never)}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
        <BottomNav active="none" />
      </SafeAreaView>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  brand: { alignItems: "center", marginBottom: 24 },
  brandLogo: { flexDirection: "row", alignItems: "center" },
  logoBar: { width: 3, height: 22, backgroundColor: C.accent, borderRadius: 2, marginRight: 10 },
  logoText: { color: C.text, fontSize: 24, fontWeight: "800", letterSpacing: 0.4 },
  brandSub: { color: C.textMute, fontSize: 12, marginTop: 6, letterSpacing: 0.4 },
  card: {
    borderRadius: 16,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
  },
  head: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.accentSoft,
    borderWidth: 1,
    borderColor: C.accentLine,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: C.text, fontSize: 14, fontWeight: "700", flex: 1 },
  body: { paddingHorizontal: 14, paddingBottom: 14 },
  bodyText: { color: C.textDim, fontSize: 13, lineHeight: 19 },
});
