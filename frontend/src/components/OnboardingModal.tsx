import React, { useState } from "react";
import {
  Dimensions, KeyboardAvoidingView, Modal, Platform,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { saveProfile } from "@/src/utils/profiles";
import { saveLoad, getLoad } from "@/src/utils/suspension";

const { width } = Dimensions.get("window");

interface Props {
  visible: boolean;
  onFinish: () => void;
}

type Step = "welcome" | "name" | "weight" | "bike";

export function OnboardingModal({ visible, onFinish }: Props) {
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("75");

  const handleFinish = async () => {
    const w = parseInt(weight) || 75;
    const n = name.trim() || "Rider";
    await saveProfile({ name: n, weightKg: w });
    const lo = await getLoad();
    await saveLoad({ ...lo, rider: w });
    onFinish();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={false} statusBarTranslucent>
      <KeyboardAvoidingView
        style={st.root}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {step === "welcome" && (
          <View style={st.step}>
            <View style={st.iconWrap}>
              <MaterialCommunityIcons name="motorbike" size={48} color="#3DA9FF" />
            </View>
            <Text style={st.title}>Welcome to{"\n"}<Text style={st.accent}>RideTune</Text></Text>
            <Text style={st.sub}>Your motorcycle suspension setup assistant.{"\n"}Let's set up your rider profile in 2 steps.</Text>
            <TouchableOpacity style={st.btn} onPress={() => setStep("name")} activeOpacity={0.9}>
              <Text style={st.btnLabel}>Get started</Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color="#04111E" />
            </TouchableOpacity>
          </View>
        )}

        {step === "name" && (
          <View style={st.step}>
            <Text style={st.stepNum}>1 / 2</Text>
            <Text style={st.title}>What's your{"\n"}<Text style={st.accent}>name?</Text></Text>
            <Text style={st.sub}>This helps personalise your setup profiles.</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#475569"
              style={st.input}
              autoFocus
              returnKeyType="next"
              onSubmitEditing={() => setStep("weight")}
            />
            <TouchableOpacity
              style={[st.btn, !name.trim() && st.btnDisabled]}
              onPress={() => name.trim() && setStep("weight")}
              activeOpacity={0.9}
            >
              <Text style={st.btnLabel}>Next</Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color="#04111E" />
            </TouchableOpacity>
          </View>
        )}

        {step === "weight" && (
          <View style={st.step}>
            <Text style={st.stepNum}>2 / 2</Text>
            <Text style={st.title}>Your weight{"\n"}<Text style={st.accent}>with gear?</Text></Text>
            <Text style={st.sub}>Include helmet, jacket, boots and any gear you ride with.</Text>
            <View style={st.weightRow}>
              <TouchableOpacity style={st.weightBtn} onPress={() => setWeight(String(Math.max(40, parseInt(weight) - 1)))}>
                <Text style={st.weightBtnLabel}>−1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={st.weightBtn} onPress={() => setWeight(String(Math.max(40, parseInt(weight) - 5)))}>
                <Text style={st.weightBtnLabel}>−5</Text>
              </TouchableOpacity>
              <View style={st.weightDisplay}>
                <Text style={st.weightValue}>{weight}</Text>
                <Text style={st.weightUnit}>kg</Text>
              </View>
              <TouchableOpacity style={st.weightBtn} onPress={() => setWeight(String(Math.min(130, parseInt(weight) + 1)))}>
                <Text style={st.weightBtnLabel}>+1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={st.weightBtn} onPress={() => setWeight(String(Math.min(130, parseInt(weight) + 5)))}>
                <Text style={st.weightBtnLabel}>+5</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={st.btn} onPress={handleFinish} activeOpacity={0.9}>
              <Text style={st.btnLabel}>Start riding</Text>
              <MaterialCommunityIcons name="check" size={18} color="#04111E" />
            </TouchableOpacity>
            <TouchableOpacity style={st.skip} onPress={handleFinish}>
              <Text style={st.skipLabel}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const st = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#070A0F",
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  step: { width: "100%", alignItems: "center" },
  stepNum: { color: "#3DA9FF", fontSize: 12, fontWeight: "700", letterSpacing: 1.4, marginBottom: 24 },
  iconWrap: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: "rgba(61,169,255,0.14)",
    borderWidth: 1, borderColor: "rgba(61,169,255,0.35)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 28,
  },
  title: { color: "#F1F5F9", fontSize: 32, fontWeight: "800", textAlign: "center", lineHeight: 40, letterSpacing: -0.5 },
  accent: { color: "#3DA9FF" },
  sub: { color: "#64748B", fontSize: 15, textAlign: "center", lineHeight: 22, marginTop: 12, marginBottom: 32 },
  input: {
    width: "100%", paddingHorizontal: 18, paddingVertical: 16,
    borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "#F1F5F9", fontSize: 18, marginBottom: 20, textAlign: "center",
  },
  btn: {
    width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 16, borderRadius: 14, backgroundColor: "#3DA9FF", marginBottom: 12,
  },
  btnDisabled: { backgroundColor: "#1e3a4f" },
  btnLabel: { color: "#04111E", fontWeight: "700", fontSize: 16 },
  weightRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 32, width: "100%" },
  weightBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)", alignItems: "center",
  },
  weightBtnLabel: { color: "#F1F5F9", fontWeight: "700", fontSize: 14 },
  weightDisplay: { flex: 2, alignItems: "center" },
  weightValue: { color: "#F1F5F9", fontSize: 36, fontWeight: "800" },
  weightUnit: { color: "#64748B", fontSize: 13 },
  skip: { paddingVertical: 8 },
  skipLabel: { color: "#475569", fontSize: 13 },
});
