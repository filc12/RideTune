import React from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { C, ScreenHeader } from "@/src/components/ScreenHeader";
import { useT } from "@/src/i18n";

export default function HowItWorks() {
  const router = useRouter();
  const { t } = useT();
  const steps: { icon: keyof typeof MaterialCommunityIcons.glyphMap; title: string; desc: string }[] = [
    { icon: "motorbike", title: t("hiw.s1.t"), desc: t("hiw.s1.d") },
    { icon: "weight-kilogram", title: t("hiw.s2.t"), desc: t("hiw.s2.d") },
    { icon: "tune-vertical", title: t("hiw.s3.t"), desc: t("hiw.s3.d") },
    { icon: "speedometer", title: t("hiw.s4.t"), desc: t("hiw.s4.d") },
  ];
  return (
    <View style={st.root} testID="how-it-works-screen">
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0B1220", "#070A0F"]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScreenHeader title={t("cta.how_it_works")} />
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          <Text style={st.kicker}>{t("hiw.kicker")}</Text>
          <Text style={st.title}>
            {t("hiw.title.l1")} <Text style={st.accent}>{t("hiw.title.l2")}</Text>.
          </Text>
          <Text style={st.subtitle}>{t("hiw.sub")}</Text>
          <View style={{ marginTop: 28, gap: 12 }}>
            {steps.map((s, i) => (
              <View key={s.title} style={st.step} testID={`step-${i + 1}`}>
                <View style={st.stepIcon}>
                  <MaterialCommunityIcons name={s.icon} size={20} color={C.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={st.stepNum}>{t("hiw.step")} {String(i + 1).padStart(2, "0")}</Text>
                  <Text style={st.stepTitle}>{s.title}</Text>
                  <Text style={st.stepDesc}>{s.desc}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={st.note}>
            <MaterialCommunityIcons name="information-outline" size={16} color={C.accent} />
            <Text style={st.noteText}>{t("hiw.note")}</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.9} style={st.cta} testID="how-it-works-cta">
            <Text style={st.ctaLabel}>{t("hiw.cta")}</Text>
            <Ionicons name="arrow-forward" size={16} color="#04111E" />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  kicker: { color: C.accent, fontSize: 11, fontWeight: "700", letterSpacing: 1.8 },
  title: { color: C.text, fontSize: 26, fontWeight: "800", marginTop: 8, lineHeight: 32, letterSpacing: -0.4 },
  accent: { color: C.accent },
  subtitle: { color: C.textDim, fontSize: 14, lineHeight: 20, marginTop: 10 },
  step: { flexDirection: "row", gap: 14, padding: 16, borderRadius: 16, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  stepIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: C.accentSoft, borderWidth: 1, borderColor: C.accentLine, alignItems: "center", justifyContent: "center" },
  stepNum: { color: C.accent, fontSize: 10.5, fontWeight: "700", letterSpacing: 1.4 },
  stepTitle: { color: C.text, fontSize: 15, fontWeight: "700", marginTop: 4 },
  stepDesc: { color: C.textMute, fontSize: 13, lineHeight: 18, marginTop: 4 },
  note: { flexDirection: "row", gap: 10, padding: 14, borderRadius: 12, backgroundColor: C.accentSoft, borderWidth: 1, borderColor: C.accentLine, marginTop: 24, alignItems: "flex-start" },
  noteText: { color: C.textDim, fontSize: 12.5, lineHeight: 18, flex: 1 },
  cta: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 28, paddingVertical: 15, borderRadius: 14, backgroundColor: C.accent },
  ctaLabel: { color: "#04111E", fontWeight: "700", fontSize: 15 },
});
