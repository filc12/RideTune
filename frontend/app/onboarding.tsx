import React, { useState } from "react";
import { useT } from "@/src/i18n";
import { KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { saveProfile } from "@/src/utils/profiles";
import { saveLoad, getLoad } from "@/src/utils/suspension";
import { storage } from "@/src/utils/storage";
import { C } from "@/src/theme";

const K_ONBOARDED = "ridetune.onboarded";
type Step = "welcome" | "name" | "weight";

export default function OnboardingScreen() {
  const router = useRouter();
  const { t } = useT();
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("75");

  const handleFinish = async () => {
    try {
      const w = parseInt(weight) || 75;
      const n = name.trim() || "Rider";
      try { await saveProfile({ name: n, weightKg: w }); } catch {}
      try {
        const lo = await getLoad();
        await saveLoad({ ...lo, rider: w });
      } catch {}
      await storage.setItem(K_ONBOARDED, "true");
    } catch {}
    router.replace("/" as never);
  };

  return (
    <View style={st.root}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView style={st.inner} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {step === "welcome" && (
          <View style={st.step}>
            <Text style={st.title}>{t("onb.welcome.title")}<Text style={st.accent}>RideTune</Text></Text>
            <Text style={st.sub}>{t("onb.welcome.sub")}</Text>
            <TouchableOpacity style={st.btn} onPress={() => setStep("name")} activeOpacity={0.9}>
              <Text style={st.btnLabel}>{t("onb.welcome.cta")}</Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color="#04111E" />
            </TouchableOpacity>
          </View>
        )}
        {step === "name" && (
          <View style={st.step}>
            <Text style={st.stepNum}>1 / 2</Text>
            <Text style={st.title}>{t("onb.name.title")}<Text style={st.accent}>{t("onb.name.accent")}</Text></Text>
            <Text style={st.sub}>{t("onb.name.sub")}</Text>
            <TextInput
              value={name} onChangeText={setName}
              placeholder={t("onb.name.ph")} placeholderTextColor="#475569"
              style={st.input} autoFocus returnKeyType="next"
              onSubmitEditing={() => setStep("weight")}
            />
            <TouchableOpacity style={[st.btn, !name.trim() && st.btnDisabled]} onPress={() => name.trim() && setStep("weight")} activeOpacity={0.9}>
              <Text style={st.btnLabel}>{t("onb.next")}</Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color="#04111E" />
            </TouchableOpacity>
          </View>
        )}
        {step === "weight" && (
          <View style={st.step}>
            <Text style={st.stepNum}>2 / 2</Text>
            <Text style={st.title}>{t("onb.weight.title")}<Text style={st.accent}>{t("onb.weight.accent")}</Text></Text>
            <Text style={st.sub}>{t("onb.weight.sub")}</Text>
            <View style={st.weightRow}>
              <TouchableOpacity style={st.weightBtn} onPress={() => setWeight(String(Math.max(40, parseInt(weight) - 5)))}><Text style={st.weightBtnLabel}>-5</Text></TouchableOpacity>
              <TouchableOpacity style={st.weightBtn} onPress={() => setWeight(String(Math.max(40, parseInt(weight) - 1)))}><Text style={st.weightBtnLabel}>-1</Text></TouchableOpacity>
              <View style={st.weightDisplay}>
                <Text style={st.weightValue}>{weight}</Text>
                <Text style={st.weightUnit}>kg</Text>
              </View>
              <TouchableOpacity style={st.weightBtn} onPress={() => setWeight(String(Math.min(130, parseInt(weight) + 1)))}><Text style={st.weightBtnLabel}>+1</Text></TouchableOpacity>
              <TouchableOpacity style={st.weightBtn} onPress={() => setWeight(String(Math.min(130, parseInt(weight) + 5)))}><Text style={st.weightBtnLabel}>+5</Text></TouchableOpacity>
            </View>
            <TouchableOpacity style={st.btn} onPress={handleFinish} activeOpacity={0.9}>
              <Text style={st.btnLabel}>{t("onb.weight.cta")}</Text>
              <MaterialCommunityIcons name="check" size={18} color="#04111E" />
            </TouchableOpacity>
            <TouchableOpacity style={st.skip} onPress={handleFinish}>
              <Text style={st.skipLabel}>{t("onb.skip")}</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  inner: { flex: 1, alignItems: "center", justifyContent: "center", padding: 28 },
  step: { width: "100%", alignItems: "center" },
  stepNum: { color: C.accent, fontSize: 12, fontWeight: "700", letterSpacing: 1.4, marginBottom: 24 },
  title: { color: C.text, fontSize: 32, fontWeight: "800", textAlign: "center", lineHeight: 40, letterSpacing: -0.5 },
  accent: { color: C.accent },
  sub: { color: "#64748B", fontSize: 15, textAlign: "center", lineHeight: 22, marginTop: 12, marginBottom: 32 },
  input: { width: "100%", paddingHorizontal: 18, paddingVertical: 16, borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.05)", color: C.text, fontSize: 18, marginBottom: 20, textAlign: "center" },
  btn: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16, borderRadius: 14, backgroundColor: C.accent, marginBottom: 12 },
  btnDisabled: { backgroundColor: "#1e3a4f" },
  btnLabel: { color: "#04111E", fontWeight: "700", fontSize: 16 },
  weightRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 32, width: "100%" },
  weightBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", alignItems: "center" },
  weightBtnLabel: { color: C.text, fontWeight: "700", fontSize: 14 },
  weightDisplay: { flex: 2, alignItems: "center" },
  weightValue: { color: C.text, fontSize: 36, fontWeight: "800" },
  weightUnit: { color: "#64748B", fontSize: 13 },
  skip: { paddingVertical: 8 },
  skipLabel: { color: "#475569", fontSize: 13 },
});
