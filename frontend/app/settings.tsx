import React from "react";
import { Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { C, ScreenHeader } from "@/src/components/ScreenHeader";
import { PremiumModal } from "@/src/components/PremiumModal";
import { canUseLanguage, getPremiumStatus, setPremiumStatusForTesting } from "@/src/services/premium";
import { LANGS, useT, type Lang } from "@/src/i18n";
import { BottomNav } from "@/src/components/BottomNav";
import { HapticButton } from "@/src/components/HapticButton";
import { tapSuccess } from "@/src/utils/haptics";
import { storage } from "@/src/utils/storage";

export default function SettingsScreen() {
  const { t, lang, setLang } = useT();
  const router = useRouter();
  const [premiumModal, setPremiumModal] = React.useState(false);
  const [tapCount, setTapCount] = React.useState(0);
  const [devOpen, setDevOpen] = React.useState(false);
  const [devPremium, setDevPremium] = React.useState(false);
  const [askPw, setAskPw] = React.useState(false);
  const [pwInput, setPwInput] = React.useState("");
  const [pwError, setPwError] = React.useState(false);

  React.useEffect(() => {
    getPremiumStatus().then(setDevPremium);
  }, []);

  const UNLOCK_PW = "121276"; // dev unlock password — change as needed

  const onVersionTap = () => {
    const next = tapCount + 1;
    setTapCount(next);
    if (next >= 7) { setAskPw(true); setPwInput(""); setPwError(false); setTapCount(0); }
  };

  const onSubmitPw = () => {
    if (pwInput === UNLOCK_PW) {
      setAskPw(false);
      setPwInput("");
      setPwError(false);
      setDevOpen(true);
      tapSuccess();
    } else {
      setPwError(true);
    }
  };

  const onReplayOnboarding = async () => {
    await storage.removeItem("ridetune.onboarded");
    router.replace("/onboarding" as never);
  };

  const onToggleDevPremium = async () => {
    const next = !devPremium;
    await setPremiumStatusForTesting(next);
    setDevPremium(next);
    tapSuccess();
  };

  return (
    <View style={st.root} testID="settings-screen">
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0B1220", "#070A0F"]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScreenHeader title={t("settings.title")} />
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120, maxWidth: 600, alignSelf: "center", width: "100%" }}>
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
              <Text style={st.rowLabel}>{t("settings.profiles")}</Text>
              <Text style={st.rowSub}>{t("settings.profiles.sub")}</Text>
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

          <HapticButton
            activeOpacity={0.85}
            onPress={onReplayOnboarding}
            style={st.row}
            testID="replay-onboarding"
          >
            <View style={st.iconBox}>
              <Ionicons name="refresh-outline" size={18} color={C.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={st.rowLabel}>{t("settings.replay_onboarding")}</Text>
              <Text style={st.rowSub}>{t("settings.replay_onboarding.sub")}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={C.textMute} />
          </HapticButton>

          <View style={st.versionWrap}>
            <Text style={st.version} onPress={onVersionTap} suppressHighlighting>
              {t("settings.version")} 1.0.0
            </Text>
          </View>

          {devOpen && (
            <View style={st.devPanel} testID="dev-panel">
              <Text style={st.devTitle}>DEV / TESTING</Text>
              <HapticButton
                haptic="none"
                activeOpacity={0.85}
                onPress={onToggleDevPremium}
                style={[st.row, devPremium && st.rowActive]}
                testID="dev-premium-toggle"
              >
                <View style={st.iconBox}>
                  <Ionicons name={devPremium ? "star" : "star-outline"} size={18} color={devPremium ? C.ok : C.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={st.rowLabel}>Premium</Text>
                  <Text style={st.rowSub}>{devPremium ? "ON — all features unlocked" : "OFF — free plan limits"}</Text>
                </View>
                <Text style={[st.devState, { color: devPremium ? C.ok : C.textMute }]}>{devPremium ? "ON" : "OFF"}</Text>
              </HapticButton>
              <Text style={st.devHint}>Tap to toggle. Restart screens to see limits apply.</Text>
            </View>
          )}
        </ScrollView>
        <BottomNav active="none" />
      </SafeAreaView>
      <Modal visible={askPw} transparent animationType="fade" onRequestClose={() => setAskPw(false)}>
        <View style={st.pwOverlay}>
          <View style={st.pwCard}>
            <Text style={st.pwTitle}>Developer unlock</Text>
            <Text style={st.pwSub}>Enter password to continue.</Text>
            <TextInput
              style={[st.pwInput, pwError && st.pwInputError]}
              value={pwInput}
              onChangeText={(v) => { setPwInput(v); setPwError(false); }}
              placeholder="Password"
              placeholderTextColor={C.textMute}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={onSubmitPw}
            />
            {pwError && <Text style={st.pwErr}>Wrong password</Text>}
            <View style={st.pwBtns}>
              <HapticButton style={st.pwBtnGhost} onPress={() => { setAskPw(false); setPwInput(""); setPwError(false); }}>
                <Text style={st.pwBtnGhostTxt}>Cancel</Text>
              </HapticButton>
              <HapticButton style={st.pwBtnOk} onPress={onSubmitPw}>
                <Text style={st.pwBtnOkTxt}>Unlock</Text>
              </HapticButton>
            </View>
          </View>
        </View>
      </Modal>

      <PremiumModal visible={premiumModal} feature="premium.feature.languages" onClose={() => setPremiumModal(false)} />
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
  devPanel: { marginTop: 20, padding: 14, borderRadius: 14, backgroundColor: "rgba(244,178,62,0.07)", borderWidth: 1, borderColor: "rgba(244,178,62,0.3)", gap: 10 },
  devTitle: { color: C.warn, fontSize: 10, fontWeight: "800", letterSpacing: 1.6 },
  devState: { fontSize: 14, fontWeight: "800", letterSpacing: 0.5 },
  devHint: { color: C.textMute, fontSize: 11, lineHeight: 15, textAlign: "center" },
  versionWrap: { marginTop: 30, alignItems: "center" },
  version: { color: C.textMute, fontSize: 12, letterSpacing: 0.6 },
  pwOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center", padding: 24 },
  pwCard: { width: "100%", maxWidth: 340, backgroundColor: "#0E1626", borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 20, gap: 10 },
  pwTitle: { color: C.text, fontSize: 16, fontWeight: "800" },
  pwSub: { color: C.textMute, fontSize: 12, lineHeight: 17 },
  pwInput: { marginTop: 4, backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: C.text, fontSize: 15 },
  pwInputError: { borderColor: C.warn },
  pwErr: { color: C.warn, fontSize: 12, fontWeight: "600" },
  pwBtns: { flexDirection: "row", gap: 10, marginTop: 6 },
  pwBtnGhost: { flex: 1, paddingVertical: 11, borderRadius: 10, borderWidth: 1, borderColor: C.border, alignItems: "center" },
  pwBtnGhostTxt: { color: C.textMute, fontSize: 14, fontWeight: "700" },
  pwBtnOk: { flex: 1, paddingVertical: 11, borderRadius: 10, backgroundColor: C.accent, alignItems: "center" },
  pwBtnOkTxt: { color: "#06121F", fontSize: 14, fontWeight: "800" },
});
