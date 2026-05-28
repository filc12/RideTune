import React from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { C, ScreenHeader } from "@/src/components/ScreenHeader";
import { PremiumModal } from "@/src/components/PremiumModal";
import { canUseLanguage } from "@/src/services/premium";
import { LANGS, useT, type Lang } from "@/src/i18n";
import { HapticButton } from "@/src/components/HapticButton";

export default function SettingsScreen() {
  const { t, lang, setLang } = useT();
  const router = useRouter();
  const [premiumModal, setPremiumModal] = React.useState(false);
  return (
    <View style={st.root} testID="settings-screen">
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0B1220", "#070A0F"]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScreenHeader title={t("settings.title")} />
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
          <Text style={st.section}>{t("settings.language").toUpperCase()}</Text>
          <View style={{ gap: 8 }}>
            {LANGS.map((l) => {
              const active = l.code === lang;
              return (
                <HapticButton
                  key={l.code}
                  activeOpacity={0.85}
                  onPress={async () => {
                    const allowed = await canUseLanguage(l.code);
                    if (!allowed) { setPremiumModal(true); return; }
                    setLang(l.code as Lang);
                  }}
                  style={[st.row, active && st.rowActive]}
                  testID={`lang-${l.code}`}
                >
                  <View style={[st.flag, active && st.flagActive]}>
                    <Text style={[st.flagLabel, active && st.flagLabelActive]}>{l.flag}</Text>
                  </View>
                  <Text style={st.rowLabel}>{l.label}</Text>
                  {active ? (
                    <Ionicons name="checkmark-circle" size={20} color={C.ok} />
                  ) : (
                    <Ionicons name="ellipse-outline" size={18} color={C.textMute} />
                  )}
                </HapticButton>
              );
            })}
          </View>

          <Text style={[st.section, { marginTop: 28 }]}>{t("settings.about").toUpperCase()}</Text>
          <HapticButton
            activeOpacity={0.85}
            onPress={() => router.push("/profiles" as never)}
            style={st.row}
            testID="open-profiles"
          >
            <View style={st.iconBox}>
              <Ionicons name="person-outline" size={18} color={C.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={st.rowLabel}>Rider Profiles</Text>
              <Text style={st.rowSub}>Manage saved rider profiles</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={C.textMute} />
          </HapticButton>

          <HapticButton
            activeOpacity={0.85}
            onPress={() => router.push("/informacoes" as never)}
            style={st.row}
            testID="open-info"
          >
            <View style={st.iconBox}>
              <Ionicons name="information-circle-outline" size={18} color={C.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={st.rowLabel}>{t("settings.about")}</Text>
              <Text style={st.rowSub}>{t("settings.about.sub")}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={C.textMute} />
          </HapticButton>

          <View style={st.versionWrap}>
            <Text style={st.version}>{t("settings.version")} 1.0.0</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
      <PremiumModal visible={premiumModal} feature="Multiple languages" onClose={() => setPremiumModal(false)} />
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  section: { color: C.accent, fontSize: 11, fontWeight: "700", letterSpacing: 1.8, marginBottom: 10 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  rowActive: { borderColor: "rgba(34,208,138,0.4)", backgroundColor: C.okSoft },
  rowLabel: { color: C.text, fontSize: 14, fontWeight: "600", flex: 1 },
  rowSub: { color: C.textMute, fontSize: 12, marginTop: 2 },
  flag: {
    width: 38,
    height: 28,
    borderRadius: 8,
    backgroundColor: C.surfaceHi,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  flagActive: { backgroundColor: C.okSoft, borderColor: "rgba(34,208,138,0.4)" },
  flagLabel: { color: C.textDim, fontWeight: "800", fontSize: 11, letterSpacing: 0.5 },
  flagLabelActive: { color: C.ok },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: C.accentSoft,
    borderWidth: 1,
    borderColor: C.accentLine,
    alignItems: "center",
    justifyContent: "center",
  },
  versionWrap: { marginTop: 30, alignItems: "center" },
  version: { color: C.textMute, fontSize: 12, letterSpacing: 0.6 },
});
