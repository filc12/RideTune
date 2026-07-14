import React, { useCallback, useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Share, StatusBar, StyleSheet, Text, TextInput, View, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { C, ScreenHeader } from "@/src/components/ScreenHeader";
import { BottomNav } from "@/src/components/BottomNav";
import { PremiumModal } from "@/src/components/PremiumModal";
import { isPremium } from "@/src/services/premium";
import { listEntries, saveEntry, updateEntry, deleteEntry, formatEntry, FREE_DIARY_LIMIT, type DiaryEntry } from "@/src/utils/diary";
import { storage } from "@/src/utils/storage";
import { tapSuccess } from "@/src/utils/haptics";
import { HapticButton } from "@/src/components/HapticButton";
import { useT } from "@/src/i18n";
import { Analytics } from "@/src/services/analytics";

const RATINGS = [1,2,3,4,5];

export default function DiaryScreen() {
  const { t } = useT();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [premium, setPremium] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [premiumModal, setPremiumModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(4);
  const [bikeLabel, setBikeLabel] = useState(t("diary.bike_unknown"));
  const [setup, setSetup] = useState("");
  const [editTarget, setEditTarget] = useState<DiaryEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DiaryEntry | null>(null);

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
      const { getLoad, calcSetupById } = await import("@/src/utils/suspension");
      const bikeId = await storage.getItem<string>("ridetune.bike", "");
      const lo = await getLoad();
      if (bikeId) {
        const s = calcSetupById(bikeId, lo);
        if (s) {
          const fp = s.front.preload;
          const fr = s.front.rebound;
          const fc = s.front.compression;
          const rp = s.rear.preload;
          const rr = s.rear.rebound;
          const rc = s.rear.compression;
          const parts = [];
          if (fp) parts.push(`F.Pre: ${fp}`);
          if (fr) parts.push(`F.Reb: ${fr}`);
          if (fc) parts.push(`F.Comp: ${fc}`);
          if (rp) parts.push(`R.Pre: ${rp}`);
          if (rr) parts.push(`R.Reb: ${rr}`);
          if (rc) parts.push(`R.Comp: ${rc}`);
          setSetup(parts.join(" | "));
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
    tapSuccess();
    if (editTarget) {
      await updateEntry(editTarget.id, { setup: setup.trim() || "No setup noted", rating, notes: notes.trim() });
    } else {
      await saveEntry({ bikeLabel, setup: setup.trim() || "No setup noted", rating, notes: notes.trim() });
      Analytics.diaryEntryCreated();
    }
    setEditTarget(null);
    setModalOpen(false);
    load();
  };

  const onDelete = (e: DiaryEntry) => {
    setDeleteTarget(e);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    tapSuccess();
    await deleteEntry(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  const onShare = async (e: DiaryEntry) => {
    await Share.share({ message: formatEntry(e) + "\n\nVer e partilhar setups em: https://www.ridetune.app/setups" });
  };

  return (
    <View style={st.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0B1220", "#070A0F"]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScreenHeader title={t("diary.title")} />
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120, maxWidth: 600, alignSelf: "center", width: "100%" }}>

        

          <Text style={st.sub}>{t("diary.sub")}</Text>
        

        

        

        

          {!premium && (
            <View style={st.limitBanner}>
              <MaterialCommunityIcons name="lock-outline" size={15} color={C.warn} />
              <Text style={st.limitText}>{t("diary.limit").replace("{n}", String(entries.length)).replace("{max}", String(FREE_DIARY_LIMIT))}</Text>
            </View>
          )}

          <HapticButton style={[st.addBtn, (!premium && entries.length >= FREE_DIARY_LIMIT) && st.addBtnLocked]} onPress={onAdd} activeOpacity={0.9}>
            <Ionicons name="add-circle" size={18} color={(!premium && entries.length >= FREE_DIARY_LIMIT) ? C.textMute : "#04111E"} />
            <Text style={[st.addLabel, (!premium && entries.length >= FREE_DIARY_LIMIT) && { color: C.textMute }]}>{t("diary.new")}</Text>
          </HapticButton>

          {entries.length === 0 ? (
            <View style={st.empty}>
              <MaterialCommunityIcons name="notebook-outline" size={32} color={C.textMute} />
              <Text style={st.emptyText}>{t("diary.empty")}</Text>
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

        <HapticButton 
          onPress={() => Linking.openURL("https://www.ridetune.app/setups")} 
          style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "rgba(56, 189, 248, 0.1)", borderWidth: 1, borderColor: "#38bdf8", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginTop: 10, marginBottom: 20 }}
        >
          <Ionicons name="globe-outline" size={18} color="#38bdf8" />
          <Text style={{ color: "#38bdf8", fontWeight: "700", fontSize: 14 }}>Partilhar na Web (ridetune.app/setups)</Text>
        </HapticButton>
                    <View style={st.cardActions}>
                      <HapticButton onPress={() => onShare(e)} style={st.actionBtn}>
                        <Ionicons name="share-outline" size={16} color={C.accent} />
                      </HapticButton>
                      <HapticButton onPress={() => onEdit(e)} style={[st.actionBtn, { borderColor: "rgba(61,169,255,0.3)" }]}>
                        <Ionicons name="pencil-outline" size={16} color={C.accent} />
                      </HapticButton>
                      <HapticButton onPress={() => onDelete(e)} haptic="warning" style={[st.actionBtn, { borderColor: "rgba(244,178,62,0.3)" }]}>
                        <Ionicons name="trash-outline" size={16} color={C.warn} />
                      </HapticButton>
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
        <BottomNav active="none" />
      </SafeAreaView>

      {/* New entry modal */}
      <Modal transparent visible={modalOpen} animationType="slide" onRequestClose={() => { setModalOpen(false); setEditTarget(null); }}>
        <Pressable style={st.backdrop} onPress={() => { setModalOpen(false); setEditTarget(null); }} />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={st.kav} pointerEvents="box-none">
        <View style={st.sheet}>
          <Text style={st.sheetTitle}>{editTarget ? t("diary.modal.edit") : t("diary.modal.new")}</Text>
          <Text style={st.sheetLabel}>{t("diary.rating")}</Text>
          <View style={st.starsRow}>
            {RATINGS.map(r => (
              <HapticButton key={r} onPress={() => setRating(r)}>
                <Text style={[st.starPick, r <= rating && st.starPickActive]}>★</Text>
              </HapticButton>
            ))}
          </View>
          <Text style={st.sheetLabel}>{t("diary.setup_label")}</Text>
          <TextInput
            value={setup ?? ""}
            onChangeText={setSetup}
            placeholder={t("diary.setup_ph")}
            placeholderTextColor={C.textMute}
            style={st.input}
          />
          <Text style={st.sheetLabel}>{t("diary.notes_label")}</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder={t("diary.notes_ph")}
            placeholderTextColor={C.textMute}
            style={[st.input, { height: 100, textAlignVertical: "top" }]}
            multiline
            autoFocus
          />
          <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
            <HapticButton onPress={() => { setModalOpen(false); setEditTarget(null); }} style={st.cancel}>
              <Text style={st.cancelLabel}>{t("common.cancel")}</Text>
            </HapticButton>
            <HapticButton onPress={onSave} haptic="none" style={[st.confirm, !notes.trim() && { opacity: 0.4 }]}>
              <Text style={st.confirmLabel}>{t("common.save")}</Text>
            </HapticButton>
          </View>
        </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal transparent visible={!!deleteTarget} animationType="fade" onRequestClose={() => setDeleteTarget(null)}>
        <Pressable style={st.delBackdrop} onPress={() => setDeleteTarget(null)} />
        <View style={st.delModal}>
          <View style={st.delIconWrap}>
            <Ionicons name="trash-outline" size={22} color={C.warn} />
          </View>
          <Text style={st.delTitle}>{t("diary.delete.title")}</Text>
          <Text style={st.delSub}>{t("diary.delete.confirm")}</Text>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
            <HapticButton onPress={() => setDeleteTarget(null)} style={st.delCancel} activeOpacity={0.8}>
              <Text style={st.delCancelLabel}>{t("common.cancel")}</Text>
            </HapticButton>
            <HapticButton onPress={confirmDelete} haptic="none" style={st.delConfirm} activeOpacity={0.9}>
              <Text style={st.delConfirmLabel}>{t("diary.delete.btn")}</Text>
            </HapticButton>
          </View>
        </View>
      </Modal>

      <PremiumModal visible={premiumModal} feature="premium.feature.diary" onClose={() => setPremiumModal(false)} />
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
  starActive: { color: C.warn },
  cardSetup: { color: C.textDim, fontSize: 12, marginBottom: 6 },
  cardNotes: { color: C.text, fontSize: 13.5, lineHeight: 20 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" },
  kav: { ...StyleSheet.absoluteFillObject, justifyContent: "flex-end" },
  sheet: { backgroundColor: "#0E141C", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, borderWidth: 1, borderColor: C.borderHi },
  sheetTitle: { color: C.text, fontSize: 17, fontWeight: "700", marginBottom: 20 },
  sheetLabel: { color: C.textDim, fontSize: 12, fontWeight: "600", letterSpacing: 0.8, marginBottom: 8, marginTop: 14 },
  starsRow: { flexDirection: "row", gap: 8 },
  starPick: { fontSize: 28, color: C.border },
  starPickActive: { color: C.warn },
  input: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: C.text, fontSize: 14, marginBottom: 4 },
  cancel: { flex: 1, paddingVertical: 13, borderRadius: 12, borderWidth: 1, borderColor: C.border, alignItems: "center", backgroundColor: C.surface },
  cancelLabel: { color: C.text, fontWeight: "600" },
  confirm: { flex: 1, paddingVertical: 13, borderRadius: 12, backgroundColor: C.accent, alignItems: "center" },
  confirmLabel: { color: "#04111E", fontWeight: "700" },
  delBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.6)" },
  delModal: { position: "absolute", left: 20, right: 20, top: "35%", backgroundColor: "#0E141C", borderRadius: 18, padding: 20, borderWidth: 1, borderColor: C.borderHi },
  delIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(244,178,62,0.15)", borderWidth: 1, borderColor: "rgba(244,178,62,0.3)", alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 14 },
  delTitle: { color: C.text, fontSize: 16, fontWeight: "700", textAlign: "center" },
  delSub: { color: C.textDim, fontSize: 13, textAlign: "center", marginTop: 8, marginBottom: 20, lineHeight: 19 },
  delCancel: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: C.border, alignItems: "center", backgroundColor: C.surface },
  delCancelLabel: { color: C.text, fontWeight: "600" },
  delConfirm: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: C.warn, alignItems: "center" },
  delConfirmLabel: { color: "#04111E", fontWeight: "700" },
});
