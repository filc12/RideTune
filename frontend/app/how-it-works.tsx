import React from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const C = {
  bg: "#070A0F",
  text: "#F1F5F9",
  textDim: "#94A3B8",
  textMute: "#64748B",
  accent: "#3DA9FF",
  accentSoft: "rgba(61,169,255,0.14)",
  accentLine: "rgba(61,169,255,0.35)",
  surface: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
};

const STEPS = [
  {
    icon: "motorbike" as const,
    title: "Escolhe a tua mota",
    desc: "Seleciona a marca e o modelo. Carregamos as gamas de afinação seguras para o teu chassis.",
  },
  {
    icon: "weight-kilogram" as const,
    title: "Define a carga real",
    desc: "Indica peso do piloto, passageiro e bagagem. O cálculo adapta-se ao teu cenário de viagem.",
  },
  {
    icon: "tune-vertical" as const,
    title: "Recebe o ponto de partida",
    desc: "Apresentamos pré-load, rebound, compression e sag recomendados para frente e trás.",
  },
  {
    icon: "speedometer" as const,
    title: "Mede e ajusta",
    desc: "Usa o guia de sag para validar. Faz pequenos ajustes até sentires a mota equilibrada.",
  },
];

export default function HowItWorks() {
  const router = useRouter();
  return (
    <View style={styles.root} testID="how-it-works-screen">
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0B1220", "#070A0F"]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            testID="back-btn"
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={20} color={C.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Como funciona</Text>
          <View style={{ width: 36 }} />
        </View>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          <Text style={styles.kicker}>O MÉTODO RIDETUNE</Text>
          <Text style={styles.title}>
            Um setup seguro, em <Text style={styles.accent}>quatro passos</Text>.
          </Text>
          <Text style={styles.subtitle}>
            A RideTune dá-te um ponto de partida fiável para a tua suspensão consoante a carga real da tua mota.
          </Text>

          <View style={{ marginTop: 28, gap: 12 }}>
            {STEPS.map((s, i) => (
              <View key={s.title} style={styles.step} testID={`step-${i + 1}`}>
                <View style={styles.stepIcon}>
                  <MaterialCommunityIcons name={s.icon} size={20} color={C.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepNum}>PASSO {String(i + 1).padStart(2, "0")}</Text>
                  <Text style={styles.stepTitle}>{s.title}</Text>
                  <Text style={styles.stepDesc}>{s.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.note}>
            <MaterialCommunityIcons name="information-outline" size={16} color={C.accent} />
            <Text style={styles.noteText}>
              Os valores recomendados são um ponto de partida seguro. Para resultados máximos, valida sempre com o teu mecânico de confiança.
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.9}
            style={styles.cta}
            testID="how-it-works-cta"
          >
            <Text style={styles.ctaLabel}>Começar agora</Text>
            <Ionicons name="arrow-forward" size={16} color="#04111E" />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { color: C.text, fontSize: 15, fontWeight: "700", letterSpacing: 0.3 },
  kicker: { color: C.accent, fontSize: 11, fontWeight: "700", letterSpacing: 1.8 },
  title: {
    color: C.text,
    fontSize: 26,
    fontWeight: "800",
    marginTop: 8,
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  accent: { color: C.accent },
  subtitle: { color: C.textDim, fontSize: 14, lineHeight: 20, marginTop: 10 },
  step: {
    flexDirection: "row",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  stepIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: C.accentSoft,
    borderWidth: 1,
    borderColor: C.accentLine,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNum: { color: C.accent, fontSize: 10.5, fontWeight: "700", letterSpacing: 1.4 },
  stepTitle: { color: C.text, fontSize: 15, fontWeight: "700", marginTop: 4 },
  stepDesc: { color: C.textMute, fontSize: 13, lineHeight: 18, marginTop: 4 },
  note: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: C.accentSoft,
    borderWidth: 1,
    borderColor: C.accentLine,
    marginTop: 24,
    alignItems: "flex-start",
  },
  noteText: { color: C.textDim, fontSize: 12.5, lineHeight: 18, flex: 1 },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 28,
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: C.accent,
  },
  ctaLabel: { color: "#04111E", fontWeight: "700", fontSize: 15 },
});
