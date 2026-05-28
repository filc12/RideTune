import React, { useCallback, useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { C, ScreenHeader } from "@/src/components/ScreenHeader";
import { BottomNav } from "@/src/components/BottomNav";
import { useT } from "@/src/i18n";
import { deleteSetup, listSetups, saveSetup, type SavedSetup } from "@/src/utils/setups";
import { useRouter } from "expo-router";
import { calcSetupById, getLoad, saveLoad } from "@/src/utils/suspension";
import { PremiumModal } from "@/src/components/PremiumModal";
import { canSaveSetup } from "@/src/services/premium";
import { ConfidenceBadge } from "@/src/components/ConfidenceBadge";
import { storage } from "@/src/utils/storage";
import { bikeLabel } from "@/src/data/bikes";
import { HapticButton } from "@/src/components/HapticButton";

export default function SetupsScreen() {
  const { t } = useT();
  const router = useRouter();
  const [items, setItems] = useState<SavedSetup[]>([]);
  const [open, setOpen] = useState(false);
  const [premiumModal, setPremiumModal] = useState(false);
  const [name, setName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const load = useCallback(async () => setItems(await listSetups()), []);
  useEffect(() => { load(); }, [load]);

  const onSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const bikeId = (await storage.getItem<string>("ridetune.bike", "")) || "";
    const lo = await getLoad();
    const setup = calcSetupById(bikeId || null, lo);
    await saveSetup({ name: trimmed, bikeId, bikeLabel: bikeLabel(bikeId), load: lo, setup, confidence: setup.confidence });
    setName("");
    setOpen(false);
    load();
  };

  const onApply = async (s: SavedSetup) => {
    await storage.setItem("ridetune.bike", s.bikeId);
    await saveLoad(s.load);
    router.push("/");
  };

  const onDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteSetup(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  return (
    <View style={st.root} testID="setups-screen">
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0B1220", "#070A0F"]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScreenHeader title={t("setups.title")} />
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
          <Text style={st.sub}>{t("setups.sub")}</Text>

          <HapticButton
            activeOpacity={0.9}
            style={st.saveBtn}
            onPress={async () => {
              const allowed = await canSaveSetup();
              if (!allowed) { setPremiumModal(true); return; }
              setOpen(true);
            }}
            testID="open-save-modal"
          >
            <Ionicons name="add-circle" size={18} color="#04111E" />
            <Text style={st.saveLabel}>{t("setups.save_current")}</Text>
          </HapticButton>

          {items.length === 0 ? (
            <View style={st.empty}>
              <MaterialCommunityIcons name="archive-outline" size={28} color={C.textMute} />
              <Text style={st.emptyText}>{t("setups.empty")}</Text>
            </View>
          ) : (
            <View style={{ marginTop: 18, gap: 10 }}>
              {items.map((s) => (
                <View key={s.id} style={st.row} testID={`setup-${s.id}`}>
                  <View style={st.rowIcon}>
                    <MaterialCommunityIcons name="content-save-cog" size={18} color={C.accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={st.rowTitle}>{s.name}</Text>
                    {s.confidence && <ConfidenceBadge level={s.confidence} compact />}
                    <Text style={st.rowMeta}>
                      {s.bikeLabel} · {s.load.rider + s.load.passenger + s.load.luggage}kg · {t("card.sag" as never)} {s.setup.sag}mm
                    </Text>
                  </View>
                  <HapticButton
                    activeOpacity={0.8}
                    onPress={() => onApply(s)} haptic="medium"
                    style={st.apply}
                    testID={`apply-${s.id}`}
                  >
                    <Ionicons name="checkmark-circle-outline" size={16} color={C.ok} />
                  </HapticButton>
                  <HapticButton
                    activeOpacity={0.7}
                    onPress={() => onDelete(s.id, s.name)} haptic="warning"
                    style={st.del}
                    testID={`delete-${s.id}`}
                  >
                    <Ionicons name="trash-outline" size={16} color={C.warn} />
                  </HapticButton>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
              <BottomNav active="home" />
      </SafeAreaView>

      <PremiumModal visible={premiumModal} feature="Saved setups" onClose={() => setPremiumModal(false)} />

      <Modal transparent visible={!!deleteTarget} animationType="fade" onRequestClose={() => setDeleteTarget(null)}>
        <Pressable style={st.backdrop} onPress={() => setDeleteTarget(null)} />
        <View style={st.modal}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(244,178,62,0.15)", borderWidth: 1, borderColor: "rgba(244,178,62,0.3)", alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 14 }}>
            <Ionicons name="trash-outline" size={22} color="#F4B23E" />
          </View>
          <Text style={[st.modalTitle, { textAlign: "center" }]}>{t("setups.delete.title" as never)}</Text>
          <Text style={{ color: "#94A3B8", fontSize: 13, textAlign: "center", marginTop: 8, marginBottom: 20, lineHeight: 19 }}>
            {t("setups.delete.confirm" as never)}{"\n"}
            <Text style={{ color: "#F1F5F9", fontWeight: "700" }}>{deleteTarget?.name}</Text>?
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <HapticButton onPress={() => setDeleteTarget(null)} style={st.cancel} activeOpacity={0.8}>
              <Text style={st.cancelLabel}>{t("common.cancel" as never)}</Text>
            </HapticButton>
            <HapticButton onPress={confirmDelete} haptic="success" style={[st.confirm, { backgroundColor: "#F4B23E" }]} activeOpacity={0.9}>
              <Text style={[st.confirmLabel, { color: "#04111E" }]}>{t("setups.delete.btn" as never)}</Text>
            </HapticButton>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={st.backdrop} onPress={() => setOpen(false)} />
        <View style={st.modal}>
          <Text style={st.modalTitle}>{t("setups.save_current")}</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t("setups.name_ph")}
            placeholderTextColor={C.textMute}
            style={st.input}
            testID="setup-name-input"
            autoFocus
          />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <HapticButton onPress={() => setOpen(false)} style={st.cancel} activeOpacity={0.8} testID="cancel-save">
              <Text style={st.cancelLabel}>{t("common.cancel")}</Text>
            </HapticButton>
            <HapticButton onPress={onSave} haptic="success" style={st.confirm} activeOpacity={0.9} testID="confirm-save">
              <Text style={st.confirmLabel}>{t("common.save")}</Text>
            </HapticButton>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  kicker: { color: C.accent, fontSize: 11, fontWeight: "700", letterSpacing: 1.8 },
  sub: { color: C.textDim, fontSize: 14, marginTop: 6, marginBottom: 18 },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: C.accent,
  },
  saveLabel: { color: "#04111E", fontWeight: "700", fontSize: 14 },
  empty: { alignItems: "center", paddingVertical: 40, gap: 10 },
  emptyText: { color: C.textDim, fontSize: 13 },
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
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: C.accentSoft,
    borderWidth: 1,
    borderColor: C.accentLine,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: { color: C.text, fontWeight: "700", fontSize: 14 },
  rowMeta: { color: C.textMute, fontSize: 12, marginTop: 2 },
  apply: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(34,208,138,0.12)",
    borderWidth: 1,
    borderColor: "rgba(34,208,138,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  del: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.warnSoft,
    borderWidth: 1,
    borderColor: "rgba(244,178,62,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.6)" },
  modal: {
    position: "absolute",
    left: 20,
    right: 20,
    top: "30%",
    backgroundColor: "#0E141C",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: C.borderHi,
  },
  modalTitle: { color: C.text, fontSize: 16, fontWeight: "700" },
  input: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
    color: C.text,
    fontSize: 14,
    marginBottom: 14,
  },
  cancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    backgroundColor: C.surface,
  },
  cancelLabel: { color: C.text, fontWeight: "600" },
  confirm: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: C.accent, alignItems: "center" },
  confirmLabel: { color: "#04111E", fontWeight: "700" },
});
