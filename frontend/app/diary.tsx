import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

import { ScreenHeader } from "@/src/components/ScreenHeader";
import { useT } from "@/src/i18n";
import {
  listEntries,
  saveEntry,
  updateEntry,
  deleteEntry,
  FREE_DIARY_LIMIT,
  type DiaryEntry,
} from "@/src/utils/diary";
import { useScreenView } from "@/src/hooks/useScreenView";

export default function DiaryScreen() {
  useScreenView("diario");
  const { t } = useT();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal (criar / editar)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fBike, setFBike] = useState("");
  const [fSetup, setFSetup] = useState("");
  const [fNotes, setFNotes] = useState("");
  const [fRating, setFRating] = useState(5);
  const [saving, setSaving] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setEntries(await listEntries());
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarrega sempre que o ecrã ganha foco (apanha entradas criadas noutros ecrãs).
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  const openNew = () => {
    setEditingId(null);
    setFBike("");
    setFSetup("");
    setFNotes("");
    setFRating(5);
    setModalOpen(true);
  };

  const openEdit = (e: DiaryEntry) => {
    setEditingId(e.id);
    setFBike(e.bikeLabel);
    setFSetup(e.setup);
    setFNotes(e.notes);
    setFRating(e.rating);
    setModalOpen(true);
  };

  const onSave = async () => {
    if (!fBike.trim() || !fSetup.trim()) {
      Alert.alert(t("diary.missing.title"), t("diary.missing.msg"));
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateEntry(editingId, {
          bikeLabel: fBike.trim(),
          setup: fSetup.trim(),
          notes: fNotes.trim(),
          rating: fRating,
        });
      } else {
        await saveEntry({
          bikeLabel: fBike.trim(),
          setup: fSetup.trim(),
          notes: fNotes.trim(),
          rating: fRating,
        });
      }
      setModalOpen(false);
      await reload();
    } finally {
      setSaving(false);
    }
  };

  const onDelete = (e: DiaryEntry) => {
    Alert.alert(t("diary.delete.title"), t("diary.delete.confirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("diary.delete.btn"),
        style: "destructive",
        onPress: async () => {
          await deleteEntry(e.id);
          await reload();
        },
      },
    ]);
  };

  const onShare = async (e: DiaryEntry) => {
    try {
      await Share.share({
        message: `${e.bikeLabel.replace(/-/g, " ")} - ${e.setup}\n\nhttps://www.ridetune.app/setups`,
      });
    } catch {
      /* utilizador cancelou */
    }
  };

  return (
    <SafeAreaView style={st.root}>
      <StatusBar barStyle="light-content" />
      <ScreenHeader title={t("diary.title")} />

      <ScrollView contentContainerStyle={st.content}>
        <Text style={st.sub}>{t("diary.sub")}</Text>

        {/* Banner do Plano */}
        <View style={st.planBanner}>
          <Ionicons name="lock-closed-outline" size={16} color="#eab308" />
          <Text style={st.planText}>
            {t("diary.limit").replace("{n}", String(entries.length)).replace("{max}", String(FREE_DIARY_LIMIT))}
          </Text>
        </View>

        {/* Botão Nova Entrada */}
        <Pressable style={st.newEntryBtn} onPress={openNew}>
          <Ionicons name="add-circle-outline" size={20} color="#090d16" />
          <Text style={st.newEntryText}>{t("diary.new")}</Text>
        </Pressable>

        {loading ? (
          <ActivityIndicator color="#38bdf8" style={{ marginTop: 24 }} />
        ) : entries.length === 0 ? (
          <Text style={st.empty}>{t("diary.empty")}</Text>
        ) : (
          entries.map((e) => (
            <View key={e.id} style={{ marginBottom: 20 }}>
              {/* Card Principal */}
              <View style={st.card}>
                <View style={st.cardHeader}>
                  <View style={st.cardHeaderText}>
                    <Text style={st.cardBike} numberOfLines={1}>
                      {e.bikeLabel.replace(/-/g, " ")}
                    </Text>
                    <Text style={st.cardDate}>
                      {new Date(e.createdAt).toLocaleDateString("pt-PT")}
                    </Text>
                  </View>

                  <View style={st.cardActions}>
                    <Pressable style={st.actionBtn} hitSlop={8} onPress={() => onShare(e)}>
                      <Ionicons name="share-outline" size={16} color="#94a3b8" />
                    </Pressable>
                    <Pressable style={st.actionBtn} hitSlop={8} onPress={() => openEdit(e)}>
                      <Ionicons name="pencil-outline" size={16} color="#94a3b8" />
                    </Pressable>
                    <Pressable style={st.actionBtn} hitSlop={8} onPress={() => onDelete(e)}>
                      <Ionicons name="trash-outline" size={16} color="#ef4444" />
                    </Pressable>
                  </View>
                </View>

                {/* Avaliação por Estrelas */}
                <View style={st.ratingRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= e.rating ? "star" : "star-outline"}
                      size={16}
                      color="#eab308"
                    />
                  ))}
                </View>

                {/* Resumo da Afinação */}
                <Text style={st.setupSummary}>⚙️ {e.setup}</Text>

                {/* Notas de Condução */}
                {e.notes ? <Text style={st.cardNotes}>{e.notes}</Text> : null}
              </View>

              {/* Botão de Partilha na Web */}
              <Pressable
                onPress={() => {
                  const params = new URLSearchParams({
                    bike: String(e.bikeLabel || "").replace(/-/g, " "),
                    setup: String(e.setup || ""),
                    notes: String(e.notes || ""),
                  });
                  Linking.openURL("https://www.ridetune.app/setups?" + params.toString());
                }}
                style={st.webShareBtn}
              >
                <Ionicons name="globe-outline" size={18} color="#38bdf8" />
                <Text style={st.webShareText}>{t("diary.share_web")}</Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal criar / editar */}
      <Modal visible={modalOpen} transparent animationType="slide" onRequestClose={() => setModalOpen(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={st.modalOverlay}
        >
          <View style={st.modalCard}>
            <View style={st.modalHeader}>
              <Text style={st.modalTitle}>{editingId ? t("diary.modal.edit") : t("diary.modal.new")}</Text>
              <Pressable onPress={() => setModalOpen(false)} hitSlop={8}>
                <Ionicons name="close" size={22} color="#ffffff" />
              </Pressable>
            </View>

            <ScrollView>
              <Text style={st.label}>{t("diary.bike_label")}</Text>
              <TextInput
                style={st.input}
                value={fBike}
                onChangeText={setFBike}
                placeholder={t("diary.bike_ph")}
                placeholderTextColor="#64748b"
              />

              <Text style={st.label}>{t("diary.setup_field")}</Text>
              <TextInput
                style={st.input}
                value={fSetup}
                onChangeText={setFSetup}
                placeholder={t("diary.setup_field_ph")}
                placeholderTextColor="#64748b"
              />

              <Text style={st.label}>{t("diary.rating")}</Text>
              <View style={st.ratingPicker}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Pressable key={star} onPress={() => setFRating(star)} hitSlop={6}>
                    <Ionicons
                      name={star <= fRating ? "star" : "star-outline"}
                      size={28}
                      color="#eab308"
                    />
                  </Pressable>
                ))}
              </View>

              <Text style={st.label}>{t("diary.notes_label")}</Text>
              <TextInput
                style={[st.input, st.inputMultiline]}
                value={fNotes}
                onChangeText={setFNotes}
                placeholder={t("diary.notes_ph")}
                placeholderTextColor="#64748b"
                multiline
              />
            </ScrollView>

            <Pressable style={[st.saveBtn, saving && { opacity: 0.6 }]} onPress={onSave} disabled={saving}>
              <Text style={st.saveBtnText}>{saving ? t("common.saving") : t("common.save")}</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#090d16" },
  content: { padding: 20 },
  sub: { color: "#94a3b8", fontSize: 14, marginBottom: 16 },
  planBanner: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(234, 179, 8, 0.1)", borderWidth: 1, borderColor: "rgba(234, 179, 8, 0.3)", padding: 12, borderRadius: 12, marginBottom: 16 },
  planText: { color: "#eab308", fontSize: 13, fontWeight: "600", flex: 1 },
  newEntryBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#38bdf8", paddingVertical: 14, borderRadius: 12, marginBottom: 20 },
  newEntryText: { color: "#090d16", fontWeight: "700", fontSize: 15 },
  empty: { color: "#64748b", fontSize: 14, textAlign: "center", marginTop: 24 },
  card: { backgroundColor: "#111827", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 16 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  cardHeaderText: { flex: 1, minWidth: 0, marginRight: 10 },
  cardBike: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
  cardDate: { color: "#64748b", fontSize: 12, marginTop: 2 },
  cardActions: { flexDirection: "row", gap: 8, flexShrink: 0 },
  actionBtn: { padding: 8, borderRadius: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.03)" },
  ratingRow: { flexDirection: "row", gap: 4, marginBottom: 10 },
  setupSummary: { color: "#94a3b8", fontSize: 12, marginBottom: 10 },
  cardNotes: { color: "#ffffff", fontSize: 14 },
  webShareBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "rgba(56, 189, 248, 0.08)", borderWidth: 1, borderColor: "#38bdf8", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginTop: 10 },
  webShareText: { color: "#38bdf8", fontWeight: "700", fontSize: 14 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#111827", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: "85%", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  modalTitle: { color: "#ffffff", fontSize: 18, fontWeight: "700" },
  label: { color: "#94a3b8", fontSize: 13, fontWeight: "600", marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: "#0b1220", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: "#ffffff", fontSize: 14 },
  inputMultiline: { minHeight: 80, textAlignVertical: "top" },
  ratingPicker: { flexDirection: "row", gap: 8 },
  saveBtn: { backgroundColor: "#38bdf8", paddingVertical: 14, borderRadius: 12, alignItems: "center", marginTop: 20 },
  saveBtnText: { color: "#090d16", fontWeight: "700", fontSize: 15 },
});
