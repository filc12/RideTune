import React, { useCallback, useEffect, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, Share, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { C, ScreenHeader } from "@/src/components/ScreenHeader";
import { BottomNav } from "@/src/components/BottomNav";
import { PremiumModal } from "@/src/components/PremiumModal";
import { isPremium } from "@/src/services/premium";
import { listEntries, saveEntry, updateEntry, deleteEntry, formatEntry, FREE_DIARY_LIMIT, type DiaryEntry } from "@/src/utils/diary";
import { storage } from "@/src/utils/storage";

const RATINGS = [1,2,3,4,5];

export default function DiaryScreen() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [premium, setPremium] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [premiumModal, setPremiumModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(4);
  const [bikeLabel, setBikeLabel] = useState("Unknown bike");
  const [setup, setSetup] = useState("");
  const [editTarget, setEditTarget] = useState<DiaryEntry | null>(null);

  const load = useCallback(async () => {
    const [all, prem] = await Promise.all([listEntries(), isPremium()]);
    setEntries(all);
    setPremium(prem);
    // Get current bike label
    const bikeId = await storage.getItem<string>("ridetune.bike", "");
    if (bikeId) setBikeLabel(bikeId.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()));
  }, []);

  useEffect(() => { load(); }, [load]);

  const onAdd = async () => {
    if (!premium && entries.length >= FREE_DIARY_LIMIT) {
      setPremiumModal(true);
      return;
    }
    setNotes("");
    setRating(4);
    // Load current app setup as starting point
    try {
      const { getLoad } = await import("@/src/utils/suspension");
      const { calcSetupById } = await import("@/src/utils/suspension");
      const bikeId = await storage.getItem<string>("ridetune.bike", "");
      const lo = await getLoad();
      if (bikeId) {
        const s = calcSetupById(bikeId, lo);
        if (s?.front?.preload) {
          const fp = s.front.preload;
          const rp = s.rear?.preload;
          setSetup(`F.Preload: ${fp}  |  R.Preload: ${rp ?? "—"}`);
        } else {
          setSetup("");
        }
      }
    } catch { setSetup(""); }
    setModalOpen(true);
  };

  const onEdit = (e: DiaryEntry) => {
    setEditTarget(e);
    setNotes(e.notes);
    setRating(e.rating);
    setSetup(e.setup);
    setModalOpen(true);
  };

  const onSave = async () => {
    if (!notes.trim()) return;
    if (editTarget) {
      await updateEntry(editTarget.id, { setup: setup.trim() || "No setup noted", rating, notes: notes.trim() });
    } else {
      await saveEntry({ bikeLabel, setup: setup.trim() || "No setup noted", rating, notes: notes.trim() });
    }
    setEditTarget(null);
    setModalOpen(false);
    load();
  };

  const onDelete = (id: string) => {
    Alert.alert("Delete entry?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { await deleteEntry(id); load(); } },
    ]);
  };

  const onShare = async (e: DiaryEntry) => {
    await Share.share({ message: formatEntry(e) });
  };

  return (
    <View style={st.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0B1220", "#070A0F"]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScreenHeader title="Ride Diary" />
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
          <Text style={st.sub}>Record your ride sensations and setup changes.</Text>

          {!premium && (
            <View style={st.limitBanner}>
              <MaterialCommunityIcons name="lock-outline" size={15} color={C.warn} />
              <Text style={st.limitText}>Free plan: {entries.length}/{FREE_DIARY_LIMIT} entries. Upgrade for unlimited.</Text>
            </View>
          )}

          <TouchableOpacity style={[st.addBtn, (!premium && entries.length >= FREE_DIARY_LIMIT) && st.addBtnLocked]} onPress={onAdd} activeOpacity={0.9}>
            <Ionicons name="add-circle" size={18} color={(!premium && entries.length >= FREE_DIARY_LIMIT) ? C.textMute : "#04111E"} />
            <Text style={[st.addLabel, (!premium && entries.length >= FREE_DIARY_LIMIT) && { color: C.textMute }]}>New entry</Text>
          </TouchableOpacity>

          {entries.length === 0 ? (
            <View style={st.empty}>
              <MaterialCommunityIcons name="notebook-outline" size={32} color={C.textMute} />
              <Text style={st.emptyText}>{"No entries yet.\nRecord your first ride sensation."}</Text>
            </View>
          ) : (
            <View style={{ marginTop: 18, gap: 12 }}>
              {entries.map((e) => (
                <View key={e.id} style={st.card}>
                  <View style={st.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={st.cardBike}>{e.bikeLabel}</Text>
                      <Text style={st.cardDate}>{new Date(e.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</Text>
                    </View>
                    <View style={st.cardActions}>
                      <TouchableOpacity onPress={() => onShare(e)} style={st.actionBtn}>
                        <Ionicons name="share-outline" size={16} color={C.accent} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => onEdit(e)} style={[st.actionBtn, { borderColor: "rgba(61,169,255,0.3)" }]}>
                        <Ionicons name="pencil-outline" size={16} color={C.accent} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => onDelete(e.id)} style={[st.actionBtn, { borderColor: "rgba(244,178,62,0.3)" }]}>
                        <Ionicons name="trash-outline" size={16} color={C.warn} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={st.stars}>
                    {RATINGS.map(r => (
                      <Text key={r} style={[st.star, r <= e.rating && st.starActive]}>★</Text>
                    ))}
                  </View>
                  {e.setup ? <Text style={st.cardSetup}>⚙️ {e.setup}</Text> : null}
                  <Text style={st.cardNotes}>{e.notes}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
        <BottomNav active="home" />
      </SafeAreaView>

      {/* New entry modal */}
      <Modal transparent visible={modalOpen} animationType="slide" onRequestClose={() => { setModalOpen(false); setEditTarget(null); }}>
        <Pressable style={st.backdrop} onPress={() => { setModalOpen(false); setEditTarget(null); }} />
        <View style={st.sheet}>
          <Text style={st.sheetTitle}>{editTarget ? "Edit entry" : "New diary entry"}</Text>
          <Text style={st.sheetLabel}>Rating</Text>
          <View style={st.starsRow}>
            {RATINGS.map(r => (
              <TouchableOpacity key={r} onPress={() => setRating(r)}>
                <Text style={[st.starPick, r <= rating && st.starPickActive]}>★</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={st.sheetLabel}>Setup changes (optional)</Text>
          <TextInput
            value={setup ?? ""}
            onChangeText={setSetup}
            placeholder="e.g. -2 clicks rear compression"
            placeholderTextColor={C.textMute}
            style={st.input}
          />
          <Text style={st.sheetLabel}>Sensations & notes</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="How did the bike feel?"
            placeholderTextColor={C.textMute}
            style={[st.input, { height: 100, textAlignVertical: "top" }]}
            multiline
            autoFocus
          />
          <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
            <TouchableOpacity onPress={() => { setModalOpen(false); setEditTarget(null); }} style={st.cancel}>
              <Text style={st.cancelLabel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSave} style={[st.confirm, !notes.trim() && { opacity: 0.4 }]}>
              <Text style={st.confirmLabel}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <PremiumModal visible={premiumModal} feature="Unlimited diary entries" onClose={() => setPremiumModal(false)} />
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  sub: { color: C.textDim, fontSize: 14, marginBottom: 16 },
  limitBanner: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 12, backgroundColor: C.warnSoft, borderWidth: 1, borderColor: "rgba(244,178,62,0.3)", marginBottom: 14 },
  limitText: { color: C.warn, fontSize: 12, flex: 1 },
  addBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 14, backgroundColor: C.accent },
  addBtnLocked: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  addLabel: { color: "#04111E", fontWeight: "700", fontSize: 14 },
  empty: { alignItems: "center", paddingVertical: 48, gap: 12 },
  emptyText: { color: C.textDim, fontSize: 13, textAlign: "center", lineHeight: 20 },
  card: { padding: 16, borderRadius: 16, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  cardBike: { color: C.text, fontWeight: "700", fontSize: 14 },
  cardDate: { color: C.textMute, fontSize: 12, marginTop: 2 },
  cardActions: { flexDirection: "row", gap: 8 },
  actionBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.accentSoft, borderWidth: 1, borderColor: C.accentLine, alignItems: "center", justifyContent: "center" },
  stars: { flexDirection: "row", gap: 4, marginBottom: 8 },
  star: { fontSize: 16, color: C.border },
  starActive: { color: "#F4B23E" },
  cardSetup: { color: C.textDim, fontSize: 12, marginBottom: 6 },
  cardNotes: { color: C.text, fontSize: 13.5, lineHeight: 20 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" },
  sheet: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: "#0E141C", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, borderWidth: 1, borderColor: C.borderHi },
  sheetTitle: { color: C.text, fontSize: 17, fontWeight: "700", marginBottom: 20 },
  sheetLabel: { color: C.textDim, fontSize: 12, fontWeight: "600", letterSpacing: 0.8, marginBottom: 8, marginTop: 14 },
  starsRow: { flexDirection: "row", gap: 8 },
  starPick: { fontSize: 28, color: C.border },
  starPickActive: { color: "#F4B23E" },
  input: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: C.text, fontSize: 14, marginBottom: 4 },
  cancel: { flex: 1, paddingVertical: 13, borderRadius: 12, borderWidth: 1, borderColor: C.border, alignItems: "center", backgroundColor: C.surface },
  cancelLabel: { color: C.text, fontWeight: "600" },
  confirm: { flex: 1, paddingVertical: 13, borderRadius: 12, backgroundColor: C.accent, alignItems: "center" },
  confirmLabel: { color: "#04111E", fontWeight: "700" },
});
