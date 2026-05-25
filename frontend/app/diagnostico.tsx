import React, { useMemo, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { C, ScreenHeader } from "@/src/components/ScreenHeader";
import { BottomNav } from "@/src/components/BottomNav";
import { useT } from "@/src/i18n";

type Tab = "quiz" | "symptoms";

const QUIZ_KEYS = ["diag.q1", "diag.q2", "diag.q3", "diag.q4", "diag.q5"] as const;

// Map question index → recommendation text
const QUIZ_FIX_KEYS: Record<number, { t: string; d: string }> = {
  0: { t: "diag.fix0.t", d: "diag.fix0.d" },
  1: { t: "diag.fix1.t", d: "diag.fix1.d" },
  2: { t: "diag.fix2.t", d: "diag.fix2.d" },
  3: { t: "diag.fix3.t", d: "diag.fix3.d" },
  4: { t: "diag.fix4.t", d: "diag.fix4.d" },
};

const SYMPTOM_ICONS: (keyof typeof MaterialCommunityIcons.glyphMap)[] = [
  "arrow-down-bold", "vibrate", "rotate-3d-variant", "wave", "account-multiple", "bag-suitcase",
];
const SYMPTOM_KEYS = [0,1,2,3,4,5];

export default function DiagScreen() {
  const { t } = useT();
  const [tab, setTab] = useState<Tab>("quiz");
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);

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
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
          <Text style={st.sub}>{t("diag.sub")}</Text>

          <View style={st.tabs}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setTab("quiz")}
              style={[st.tab, tab === "quiz" && st.tabActive]}
              testID="tab-quiz"
            >
              <Text style={[st.tabLabel, tab === "quiz" && st.tabLabelActive]}>{t("diag.tab.quiz")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setTab("symptoms")}
              style={[st.tab, tab === "symptoms" && st.tabActive]}
              testID="tab-symptoms"
            >
              <Text style={[st.tabLabel, tab === "symptoms" && st.tabLabelActive]}>{t("diag.tab.symptoms")}</Text>
            </TouchableOpacity>
          </View>

          {tab === "quiz" && !done && (
            <View style={st.qCard} testID={`q-${idx}`}>
              <Text style={st.qNum}>{idx + 1} / {QUIZ_KEYS.length}</Text>
              <Text style={st.qText}>{t(QUIZ_KEYS[idx])}</Text>
              <View style={st.qButtons}>
                <TouchableOpacity onPress={() => onAnswer(false)} style={st.qNo} activeOpacity={0.85} testID="answer-no">
                  <Text style={st.qNoLabel}>{t("diag.no")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onAnswer(true)} style={st.qYes} activeOpacity={0.85} testID="answer-yes">
                  <Text style={st.qYesLabel}>{t("diag.yes")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {tab === "quiz" && done && (
            <View testID="quiz-results">
              <Text style={st.resultTitle}>{t("diag.result")}</Text>
              {recs.length === 0 ? (
                <View style={st.okCard}>
                  <Ionicons name="checkmark-circle" size={20} color={C.ok} />
                  <Text style={st.okText}>{t("diag.ok" as never)}</Text>
                </View>
              ) : (
                recs.map((r, i) => (
                  <View key={i} style={st.symptom}>
                    <View style={st.symIcon}>
                      <MaterialCommunityIcons name="wrench" size={16} color={C.accent} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={st.symTitle}>{t(r.t as never)}</Text>
                      <Text style={st.symFix}>{t(r.d as never)}</Text>
                    </View>
                  </View>
                ))
              )}
              <TouchableOpacity onPress={restart} activeOpacity={0.85} style={st.restart} testID="restart-quiz">
                <Ionicons name="refresh" size={16} color={C.text} />
                <Text style={st.restartLabel}>{t("diag.restart")}</Text>
              </TouchableOpacity>
            </View>
          )}

          {tab === "symptoms" && (
            <View style={{ gap: 10, marginTop: 6 }} testID="symptoms-list">
              {SYMPTOM_KEYS.map((i) => (
                <View key={i} style={st.symptom}>
                  <View style={st.symIcon}>
                    <MaterialCommunityIcons name={SYMPTOM_ICONS[i]} size={18} color={C.accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={st.symTitle}>{t(`diag.sym${i}.t` as never)}</Text>
                    <Text style={st.symFix}>{t(`diag.sym${i}.d` as never)}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
              <BottomNav active="diag" />
      </SafeAreaView>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  kicker: { color: C.accent, fontSize: 11, fontWeight: "700", letterSpacing: 1.8 },
  sub: { color: C.textDim, fontSize: 14, marginTop: 6, marginBottom: 16 },
  tabs: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 12,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 16,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: "center" },
  tabActive: { backgroundColor: C.accentSoft, borderWidth: 1, borderColor: C.accentLine },
  tabLabel: { color: C.textDim, fontSize: 13, fontWeight: "600" },
  tabLabelActive: { color: C.accent, fontWeight: "700" },
  qCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    marginTop: 4,
  },
  qNum: { color: C.accent, fontWeight: "700", letterSpacing: 1.4, fontSize: 11 },
  qText: { color: C.text, fontSize: 18, fontWeight: "700", marginTop: 10, lineHeight: 24 },
  qButtons: { flexDirection: "row", gap: 10, marginTop: 20 },
  qNo: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
  },
  qNoLabel: { color: C.text, fontWeight: "700" },
  qYes: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: C.accent,
    alignItems: "center",
  },
  qYesLabel: { color: "#04111E", fontWeight: "700" },
  resultTitle: { color: C.accent, fontWeight: "700", letterSpacing: 1.4, fontSize: 11, marginBottom: 10 },
  symptom: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 8,
  },
  symIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: C.accentSoft,
    borderWidth: 1,
    borderColor: C.accentLine,
    alignItems: "center",
    justifyContent: "center",
  },
  symTitle: { color: C.text, fontWeight: "700", fontSize: 14 },
  symFix: { color: C.textMute, fontSize: 12.5, lineHeight: 17, marginTop: 3 },
  okCard: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: C.okSoft,
    borderWidth: 1,
    borderColor: "rgba(34,208,138,0.35)",
    alignItems: "center",
    marginBottom: 12,
  },
  okText: { color: C.text, fontSize: 13, flex: 1 },
  restart: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  restartLabel: { color: C.text, fontWeight: "600" },
});
