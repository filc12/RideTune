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

          {/* Clicks explainer */}
          <View style={st.clicksHeader}>
            <View style={st.clicksIcon}>
              <MaterialCommunityIcons name="cog-outline" size={18} color={C.accent} />
            </View>
            <Text style={st.clicksTitle}>{t("hiw.clicks.title")}</Text>
          </View>
          <Text style={st.clicksIntro}>{t("hiw.clicks.intro")}</Text>

          <View style={{ gap: 10, marginTop: 14 }}>
            <ClickBlock
              icon="arrow-collapse-vertical"
              title={t("hiw.clicks.preload.t")}
              desc={t("hiw.clicks.preload.d")}
              testID="clicks-preload"
            />
            <ClickBlock
              icon="arrow-up-bold"
              title={t("hiw.clicks.rebound.t")}
              desc={t("hiw.clicks.rebound.d")}
              testID="clicks-rebound"
            />
            <ClickBlock
              icon="arrow-down-bold"
              title={t("hiw.clicks.compression.t")}
              desc={t("hiw.clicks.compression.d")}
              testID="clicks-compression"
            />
          </View>

          <View style={st.howto}>
            <View style={st.howtoHead}>
              <MaterialCommunityIcons name="lightbulb-on-outline" size={16} color={C.ok} />
              <Text style={st.howtoTitle}>{t("hiw.clicks.howto.t")}</Text>
            </View>
            <Text style={st.howtoText}>{t("hiw.clicks.howto.d")}</Text>
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

function ClickBlock({
  icon,
  title,
  desc,
  testID,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  desc: string;
  testID?: string;
}) {
  return (
    <View style={st.clickBlock} testID={testID}>
      <View style={st.clickIcon}>
        <MaterialCommunityIcons name={icon} size={16} color={C.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={st.clickTitle}>{title}</Text>
        <Text style={st.clickDesc}>{desc}</Text>
      </View>
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
  // Clicks explainer
  clicksHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 32 },
  clicksIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: C.accentSoft, borderWidth: 1, borderColor: C.accentLine, alignItems: "center", justifyContent: "center" },
  clicksTitle: { color: C.text, fontSize: 18, fontWeight: "800", flex: 1, letterSpacing: -0.2 },
  clicksIntro: { color: C.textDim, fontSize: 13.5, lineHeight: 20, marginTop: 12 },
  clickBlock: { flexDirection: "row", gap: 12, padding: 14, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  clickIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.accentSoft, borderWidth: 1, borderColor: C.accentLine, alignItems: "center", justifyContent: "center" },
  clickTitle: { color: C.text, fontSize: 14, fontWeight: "700" },
  clickDesc: { color: C.textMute, fontSize: 12.5, lineHeight: 17, marginTop: 4 },
  howto: { marginTop: 14, padding: 14, borderRadius: 12, backgroundColor: "rgba(34,208,138,0.10)", borderWidth: 1, borderColor: "rgba(34,208,138,0.35)" },
  howtoHead: { flexDirection: "row", alignItems: "center", gap: 8 },
  howtoTitle: { color: C.ok, fontSize: 11, fontWeight: "800", letterSpacing: 1.4, textTransform: "uppercase" },
  howtoText: { color: C.text, fontSize: 13, lineHeight: 19, marginTop: 8 },
  cta: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 28, paddingVertical: 15, borderRadius: 14, backgroundColor: C.accent },
  ctaLabel: { color: "#04111E", fontWeight: "700", fontSize: 15 },
});
