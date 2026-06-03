import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { C, ScreenHeader } from "@/src/components/ScreenHeader";
import { BottomNav } from "@/src/components/BottomNav";
import { PremiumModal } from "@/src/components/PremiumModal";
import { useT } from "@/src/i18n";
import { isPremium } from "@/src/services/premium";
import { HapticButton } from "@/src/components/HapticButton";

const QUIZ_KEYS = ["diag.q1", "diag.q2", "diag.q3", "diag.q4", "diag.q5"] as const;

const QUIZ_FIX_KEYS: Record<number, { t: string; d: string }> = {
  0: { t: "diag.fix0.t", d: "diag.fix0.d" },
  1: { t: "diag.fix1.t", d: "diag.fix1.d" },
  2: { t: "diag.fix2.t", d: "diag.fix2.d" },
  3: { t: "diag.fix3.t", d: "diag.fix3.d" },
  4: { t: "diag.fix4.t", d: "diag.fix4.d" },
};

export default function DiagScreen() {
  const { t } = useT();
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [premium, setPremium] = useState(false);
  const [premiumModal, setPremiumModal] = useState(false);

  useEffect(() => {
    isPremium().then(setPremium);
  }, []);

  const recs = useMemo(
    () =>
      Object.entries(answers)
        .filter(([, v]) => v)
        .map(([k]) => QUIZ_FIX_KEYS[Number(k)])
        .filter(Boolean),
    [answers],
  );

  const onAnswer = (v: boolean) => {
    const next = { ...answers, [idx]: v };
    setAnswers(next);
    if (idx + 1 < QUIZ_KEYS.length) setIdx(idx + 1);
    else setDone(true);
  };

  const restart = () => {
    setAnswers({});
    setIdx(0);
    setDone(false);
  };

  return (
    <View style={st.root} testID="diag-screen">
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0B1220", "#070A0F"]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScreenHeader title={t("diag.title")} />
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120, maxWidth: 600, alignSelf: "center", width: "100%" }}>
          <Text style={st.sub}>{t("diag.sub")}</Text>

          {!done && (
            <View style={st.qCard} testID={`q-${idx}`}>
              <Text style={st.qNum}>{idx + 1} / {QUIZ_KEYS.length}</Text>
              <Text style={st.qText}>{t(QUIZ_KEYS[idx])}</Text>
              <View style={st.qButtons}>
                <HapticButton onPress={() => onAnswer(false)} haptic="medium" style={st.qNo} activeOpacity={0.85} testID="answer-no">
                  <Text style={st.qNoLabel}>{t("diag.no")}</Text>
                </HapticButton>
                <HapticButton onPress={() => onAnswer(true)} haptic="medium" style={st.qYes} activeOpacity={0.85} testID="answer-yes">
                  <Text style={st.qYesLabel}>{t("diag.yes")}</Text>
                </HapticButton>
              </View>
            </View>
          )}

          {done && (
            <View testID="quiz-results">
              <Text style={st.resultTitle}>{t("diag.result")}</Text>

              {/* Free users: show lock */}
              {!premium && recs.length > 0 && (
                <HapticButton style={st.lockCard} onPress={() => setPremiumModal(true)} activeOpacity={0.85}>
                  <View style={st.lockIcon}>
                    <MaterialCommunityIcons name="lock" size={20} color={C.warn} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={st.lockTitle}>{t("diag.locked.title")}</Text>
                    <Text style={st.lockSub}>{t("diag.locked.sub")}</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={18} color={C.warn} />
                </HapticButton>
              )}

              {/* All clear */}
              {recs.length === 0 && (
                <View style={st.okCard}>
                  <Ionicons name="checkmark-circle" size={20} color={C.ok} />
                  <Text style={st.okText}>{t("diag.ok" as never)}</Text>
                </View>
              )}

              {/* Premium users: show recommendations */}
              {premium && recs.length > 0 && recs.map((r, i) => (
                <View key={i} style={st.symptom}>
                  <View style={st.symIcon}>
                    <MaterialCommunityIcons name="wrench" size={16} color={C.accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={st.symTitle}>{t(r.t as never)}</Text>
                    <Text style={st.symFix}>{t(r.d as never)}</Text>
                  </View>
                </View>
              ))}

              <HapticButton onPress={restart} activeOpacity={0.85} style={st.restart} testID="restart-quiz">
                <Ionicons name="refresh" size={16} color={C.text} />
                <Text style={st.restartLabel}>{t("diag.restart")}</Text>
              </HapticButton>
            </View>
          )}
        </ScrollView>
        <BottomNav active="diag" />
      </SafeAreaView>
      <PremiumModal visible={premiumModal} feature="premium.feature.diagnostics" onClose={() => setPremiumModal(false)} />
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  sub: { color: C.textDim, fontSize: 14, marginTop: 6, marginBottom: 16 },
  qCard: { padding: 20, borderRadius: 16, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, marginTop: 4 },
  qNum: { color: C.accent, fontWeight: "700", letterSpacing: 1.4, fontSize: 11 },
  qText: { color: C.text, fontSize: 18, fontWeight: "700", marginTop: 10, lineHeight: 24 },
  qButtons: { flexDirection: "row", gap: 10, marginTop: 20 },
  qNo: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: "center" },
  qNoLabel: { color: C.text, fontWeight: "700" },
  qYes: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: C.accent, alignItems: "center" },
  qYesLabel: { color: "#04111E", fontWeight: "700" },
  resultTitle: { color: C.accent, fontWeight: "700", letterSpacing: 1.4, fontSize: 11, marginBottom: 10 },
  lockCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderRadius: 14, backgroundColor: "rgba(244,178,62,0.08)", borderWidth: 1, borderColor: "rgba(244,178,62,0.3)", marginBottom: 12 },
  lockIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(244,178,62,0.15)", borderWidth: 1, borderColor: "rgba(244,178,62,0.3)", alignItems: "center", justifyContent: "center" },
  lockTitle: { color: C.warn, fontWeight: "700", fontSize: 14 },
  lockSub: { color: "#94A3B8", fontSize: 12.5, marginTop: 3, lineHeight: 17 },
  symptom: { flexDirection: "row", gap: 12, padding: 14, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, marginBottom: 8 },
  symIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.accentSoft, borderWidth: 1, borderColor: C.accentLine, alignItems: "center", justifyContent: "center" },
  symTitle: { color: C.text, fontWeight: "700", fontSize: 14 },
  symFix: { color: C.textMute, fontSize: 12.5, lineHeight: 17, marginTop: 3 },
  okCard: { flexDirection: "row", gap: 10, padding: 14, borderRadius: 12, backgroundColor: C.okSoft, borderWidth: 1, borderColor: "rgba(34,208,138,0.35)", alignItems: "center", marginBottom: 12 },
  okText: { color: C.text, fontSize: 13, flex: 1 },
  restart: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface },
  restartLabel: { color: C.text, fontWeight: "600" },
});
