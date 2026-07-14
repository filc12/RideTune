import React, { useCallback, useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Share, StatusBar, StyleSheet, Text, TextInput, View, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { C, ScreenHeader } from "@/src/components/ScreenHeader";

// Definição de Tipos
interface DiaryEntry {
  id: string;
  bikeLabel: string;
  createdAt: string;
  rating: number;
  setupSummary: string;
  notes: string;
}

export default function DiaryScreen() {
  const [entries, setEntries] = useState<DiaryEntry[]>([
    {
      id: "1",
      bikeLabel: "Honda-Transalp-2026",
      createdAt: new Date().toISOString(),
      rating: 4,
      setupSummary: "F.Pre: 6 | F.Reb: 1 | F.Comp: 11 | R.Pre: 2.25 | R.Reb: 1.25 | R.Comp: 2.5",
      notes: "top"
    }
  ]);

  const onShare = async (e: DiaryEntry) => {
    await Share.share({ message: `${e.bikeLabel} - ${e.setupSummary}\n\n"https://www.ridetune.app/setups"` });
  };

  return (
    <SafeAreaView style={st.root}>
      <StatusBar barStyle="light-content" />
      <ScreenHeader title="Diário de Viagem" />

      <ScrollView contentContainerStyle={st.content}>
        <Text style={st.sub}>
          Regista as tuas sensações de condução e mudanças de setup.
        </Text>

        {/* Banner Plano Grátis */}
        <View style={st.planBanner}>
          <Ionicons name="lock-closed-outline" size={16} color="#eab308" />
          <Text style={st.planText}>Plano grátis: 1/3 entradas. Faz upgrade para ilimitadas.</Text>
        </View>

        {/* Botão Nova Entrada */}
        <Pressable style={st.newEntryBtn}>
          <Ionicons name="add-circle" size={20} color="#ffffff" />
          <Text style={st.newEntryText}>Nova entrada</Text>
        </Pressable>

        {/* Lista de Registos */}
        {entries.map((e) => (
          <View key={e.id} style={{ marginBottom: 16 }}>
            {/* CARD PRINCIPAL (Isolado) */}
            <View style={st.card}>
              <View style={st.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={st.cardBike}>{e.bikeLabel}</Text>
                  <Text style={st.cardDate}>
                    {new Date(e.createdAt).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" })}
                  </Text>
                </View>
                <View style={st.cardActions}>
                  <Pressable onPress={() => onShare(e)} style={st.actionBtn}>
                    <Ionicons name="share-outline" size={16} color={C.accent} />
                  </Pressable>
                  <Pressable style={[st.actionBtn, { borderColor: "rgba(61,169,255,0.3)" }]}>
                    <Ionicons name="pencil-outline" size={16} color={C.accent} />
                  </Pressable>
                  <Pressable style={[st.actionBtn, { borderColor: "rgba(239,68,68,0.3)" }]}>
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  </Pressable>
                </View>
              </View>

              {/* Estrelas */}
              <View style={st.ratingRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= e.rating ? "star" : "star-outline"}
                    size={16}
                    color="#f59e0b"
                  />
                ))}
              </View>

              {/* Resumo do Setup */}
              <Text style={st.setupSummary}>⚙️ {e.setupSummary}</Text>

              {/* Notas do utilizador */}
              <Text style={st.cardNotes}>{e.notes}</Text>
            </View>

            {/* BOTÃO FORA E POR BAIXO DO CARD */}
            <Pressable 
              onPress={() => {
                const params = new URLSearchParams({
                  bike: e.bikeLabel,
                  setup: e.setupSummary,
                  notes: e.notes || "",
                  action: "share"
                }).toString();
                Linking.openURL(`https://www.ridetune.app/setups?${params}`);
              }} 
              style={st.webShareBtn}
            >
            >
              <Ionicons name="globe-outline" size={18} color="#38bdf8" />
              <Text style={st.webShareText}>Partilhar na Web (ridetune.app/setups)</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#090d16" },
  content: { padding: 20 },
  sub: { color: "#94a3b8", fontSize: 14, marginBottom: 16 },
  planBanner: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(234, 179, 8, 0.1)", borderWidth: 1, borderColor: "rgba(234, 179, 8, 0.3)", padding: 12, borderRadius: 12, marginBottom: 16 },
  planText: { color: "#eab308", fontSize: 13, fontWeight: "600" },
  newEntryBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#38bdf8", paddingVertical: 14, borderRadius: 12, marginBottom: 20 },
  newEntryText: { color: "#090d16", fontWeight: "700", fontSize: 15 },
  card: { backgroundColor: "#111827", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 16 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  cardBike: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
  cardDate: { color: "#64748b", fontSize: 12, marginTop: 2 },
  cardActions: { flexDirection: "row", gap: 8 },
  actionBtn: { padding: 8, borderRadius: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.03)" },
  ratingRow: { flexDirection: "row", gap: 4, marginBottom: 10 },
  setupSummary: { color: "#94a3b8", fontSize: 12, marginBottom: 10 },
  cardNotes: { color: "#ffffff", fontSize: 14 },
  webShareBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "rgba(56, 189, 248, 0.08)", borderWidth: 1, borderColor: "#38bdf8", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginTop: 10 },
  webShareText: { color: "#38bdf8", fontWeight: "700", fontSize: 14 }
});
