import React from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { C, ScreenHeader } from "@/src/components/ScreenHeader";
import { BottomNav } from "@/src/components/BottomNav";
import { useT } from "@/src/i18n";

export default function SagScreen() {
  const { t } = useT();
  const steps: { t: string; d: string }[] = [
    { t: t("sag.step1.t"), d: t("sag.step1.d") },
    { t: t("sag.step2.t"), d: t("sag.step2.d") },
    { t: t("sag.step3.t"), d: t("sag.step3.d") },
    { t: t("sag.step4.t"), d: t("sag.step4.d") },
  ];
  return (
    <View style={st.root} testID="sag-screen">
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0B1220", "#070A0F"]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScreenHeader title={t("sag.title")} />
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
          <Text style={st.sub}>{t("sag.sub")}</Text>

          <View style={{ marginTop: 20, gap: 12 }}>
            {steps.map((s, i) => (
              <View key={i} style={st.step} testID={`sag-step-${i + 1}`}>
                <View style={st.num}>
                  <Text style={st.numLabel}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={st.title}>{s.t}</Text>
                  <Text style={st.desc}>{s.d}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={st.tip}>
            <MaterialCommunityIcons name="lightbulb-on-outline" size={18} color={C.accent} />
            <Text style={st.tipText}>{t("sag.tip")}</Text>
          </View>
        </ScrollView>
              <BottomNav active="sag" />
      </SafeAreaView>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  sub: { color: C.textDim, fontSize: 14, marginTop: 6 },
  step: {
    flexDirection: "row",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  num: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: C.accentSoft,
    borderWidth: 1,
    borderColor: C.accentLine,
    alignItems: "center",
    justifyContent: "center",
  },
  numLabel: { color: C.accent, fontWeight: "800", fontSize: 16 },
  title: { color: C.text, fontSize: 15, fontWeight: "700" },
  desc: { color: C.textMute, fontSize: 13, lineHeight: 18, marginTop: 4 },
  tip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: C.accentSoft,
    borderWidth: 1,
    borderColor: C.accentLine,
    marginTop: 18,
  },
  tipText: { color: C.text, fontSize: 13, flex: 1 },
});
