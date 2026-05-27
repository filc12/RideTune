import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { storage } from "@/src/utils/storage";
import { C, ScreenHeader } from "@/src/components/ScreenHeader";
import { BottomNav } from "@/src/components/BottomNav";
import { useT } from "@/src/i18n";
import { calcSetup, calcSetupById, getLoad, saveLoad, type Load } from "@/src/utils/suspension";
import { getActiveProfile, updateProfile, type RiderProfile } from "@/src/utils/profiles";

const RIDER_BOUNDS = { min: 40, max: 130, step: 1 };
const PASSENGER_BOUNDS = { min: 0, max: 120, step: 1 };
const LUGGAGE_BOUNDS = { min: 0, max: 60, step: 1 };

export default function CargaScreen() {
  const { t } = useT();
  const router = useRouter();
  const [load, setLoad] = useState<Load>({ rider: 75, passenger: 0, luggage: 0 });
  const [bikeId, setBikeId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeProfile, setActiveProfile] = useState<RiderProfile | null>(null);
  const [confirmProfile, setConfirmProfile] = useState(false);

  useEffect(() => {
    (async () => {
      const active = await getActiveProfile();
      if (active) setActiveProfile(active);
      const stored = await getLoad();
      if (active && stored.rider === 75) {
        setLoad({ ...stored, rider: active.weightKg });
      } else {
        setLoad(stored);
      }
      const id = await storage.getItem<string>("ridetune.bike", "");
      if (id) setBikeId(id);
    })();
  }, []);

  const total = load.rider + load.passenger + load.luggage;
  const preview = calcSetupById(bikeId, load);

  const update = (k: keyof Load, v: number, b: typeof RIDER_BOUNDS) => {
    const nv = Math.max(b.min, Math.min(b.max, v));
    setLoad((p) => ({ ...p, [k]: nv }));
    setSaved(false);
  };

  const doSave = async (updateProf: boolean) => {
    await saveLoad(load);
    if (updateProf && activeProfile && load.rider !== activeProfile.weightKg) {
      await updateProfile(activeProfile.id, { weightKg: load.rider });
      setActiveProfile({ ...activeProfile, weightKg: load.rider });
    }
    setSaved(true);
    setTimeout(() => router.back(), 600);
  };

  const onSave = async () => {
    if (activeProfile && load.rider !== activeProfile.weightKg) {
      setConfirmProfile(true);
    } else {
      await doSave(false);
    }
  };

  return (
    <View style={st.root} testID="carga-screen">
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0B1220", "#070A0F"]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScreenHeader title={t("carga.title")} />
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
            <Text style={st.h1}>{t("carga.sub")}</Text>

            <WeightRow
              icon="account"
              label={t("carga.rider")}
              value={load.rider}
              bounds={RIDER_BOUNDS}
              onChange={(v) => update("rider", v, RIDER_BOUNDS)}
              testID="rider-row"
            />
            <WeightRow
              icon="account-multiple"
              label={t("carga.passenger")}
              value={load.passenger}
              bounds={PASSENGER_BOUNDS}
              onChange={(v) => update("passenger", v, PASSENGER_BOUNDS)}
              testID="passenger-row"
            />
            <WeightRow
              icon="bag-suitcase"
              label={t("carga.luggage")}
              value={load.luggage}
              bounds={LUGGAGE_BOUNDS}
              onChange={(v) => update("luggage", v, LUGGAGE_BOUNDS)}
              testID="luggage-row"
            />

            <View style={st.totalCard}>
              <View>
                <Text style={st.totalLabel}>{t("carga.total")}</Text>
                <Text style={st.totalValue}>{total} <Text style={st.totalUnit}>{t("carga.kg")}</Text></Text>
              </View>
              <View style={st.previewRight}>
                <Text style={st.previewLabel}>Sag</Text>
                <Text style={st.previewValue}>{preview.sag} mm</Text>
              </View>
            </View>

            <View style={st.previewRow}>
              <PreviewCell label={t("card.front") + " · " + t("card.preload")} value={preview.adjDetails ? (preview.adjDetails.front.preload.match(/^[0-9.]+/) || [String(preview.front.preload)])[0] : String(preview.front.preload)} unit={preview.adjDetails ? (preview.adjDetails.front.preload.indexOf('mm') >= 0 ? 'mm' : 'clks') : 'clks'} />
              <PreviewCell label={t("card.rear") + " · " + t("card.preload")} value={preview.adjDetails ? (preview.adjDetails.rear.preload.match(/^[0-9.]+/) || [String(preview.rear.preload)])[0] : String(preview.rear.preload)} unit={preview.adjDetails ? (preview.adjDetails.rear.preload.indexOf('mm') >= 0 ? 'mm' : 'clks') : 'clks'} />
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              style={[st.save, saved && st.saveOk]}
              onPress={onSave}
              testID="save-load"
            >
              <Ionicons
                name={saved ? "checkmark-circle" : "save-outline"}
                size={18}
                color={saved ? "#04111E" : "#04111E"}
              />
              <Text style={st.saveLabel}>{saved ? t("carga.saved") : t("carga.save")}</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
              <BottomNav active="carga" />

      <Modal transparent visible={confirmProfile} animationType="fade" onRequestClose={() => setConfirmProfile(false)}>
        <Pressable style={st.backdrop} onPress={() => setConfirmProfile(false)} />
        <View style={st.modal}>
          <Text style={st.modalTitle}>Update profile?</Text>
          <Text style={{ color: "#94A3B8", fontSize: 13, marginTop: 8, marginBottom: 20, lineHeight: 19 }}>
            Update <Text style={{ color: "#F1F5F9", fontWeight: "700" }}>{activeProfile?.name}</Text> profile weight to <Text style={{ color: "#F1F5F9", fontWeight: "700" }}>{load.rider} kg</Text>?
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity onPress={() => { setConfirmProfile(false); doSave(false); }} style={st.cancel} activeOpacity={0.8}>
              <Text style={st.cancelLabel}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setConfirmProfile(false); doSave(true); }} style={st.confirm} activeOpacity={0.9}>
              <Text style={st.confirmLabel}>Yes, update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </SafeAreaView>
    </View>
  );
}

function WeightRow({
  icon,
  label,
  value,
  bounds,
  onChange,
  testID,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: number;
  bounds: { min: number; max: number; step: number };
  onChange: (v: number) => void;
  testID?: string;
}) {
  const pct = ((value - bounds.min) / (bounds.max - bounds.min)) * 100;
  return (
    <View style={st.weightRow} testID={testID}>
      <View style={st.weightHead}>
        <View style={st.weightIcon}>
          <MaterialCommunityIcons name={icon} size={18} color={C.accent} />
        </View>
        <Text style={st.weightLabel}>{label}</Text>
        <Text style={st.weightValue}>
          {value}
          <Text style={st.weightUnit}> kg</Text>
        </Text>
      </View>
      <View style={st.barTrack}>
        <View style={[st.barFill, { width: `${Math.max(2, pct)}%` }]} />
      </View>
      <View style={st.stepRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={st.stepBtn}
          onPress={() => onChange(value - 5)}
          testID={`${testID}-minus5`}
        >
          <Text style={st.stepLabel}>−5</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={st.stepBtn}
          onPress={() => onChange(value - 1)}
          testID={`${testID}-minus1`}
        >
          <Text style={st.stepLabel}>−1</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          activeOpacity={0.8}
          style={st.stepBtn}
          onPress={() => onChange(value + 1)}
          testID={`${testID}-plus1`}
        >
          <Text style={st.stepLabel}>+1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={st.stepBtn}
          onPress={() => onChange(value + 5)}
          testID={`${testID}-plus5`}
        >
          <Text style={st.stepLabel}>+5</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PreviewCell({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <View style={st.previewCell}>
      <Text style={st.previewCellLabel}>{label}</Text>
      <Text style={st.previewCellValue}>{value}{unit ? <Text style={st.previewCellUnit}> {unit}</Text> : null}</Text>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  kicker: { color: C.accent, fontSize: 11, fontWeight: "700", letterSpacing: 1.8 },
  h1: { color: C.textDim, fontSize: 14, marginTop: 6, marginBottom: 18 },
  weightRow: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 12,
  },
  weightHead: { flexDirection: "row", alignItems: "center", gap: 12 },
  weightIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.accentSoft,
    borderWidth: 1,
    borderColor: C.accentLine,
    alignItems: "center",
    justifyContent: "center",
  },
  weightLabel: { color: C.text, fontSize: 14, fontWeight: "600", flex: 1 },
  weightValue: { color: C.text, fontSize: 20, fontWeight: "700" },
  weightUnit: { color: C.textMute, fontSize: 12, fontWeight: "500" },
  barTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginTop: 12,
    overflow: "hidden",
  },
  barFill: { height: 6, backgroundColor: C.accent, borderRadius: 3 },
  stepRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  stepBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: C.border,
  },
  stepLabel: { color: C.text, fontWeight: "700", fontSize: 13 },
  totalCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    backgroundColor: C.accentSoft,
    borderWidth: 1,
    borderColor: C.accentLine,
    marginTop: 6,
  },
  totalLabel: { color: C.accent, fontSize: 11, fontWeight: "700", letterSpacing: 1.4 },
  totalValue: { color: C.text, fontSize: 28, fontWeight: "800", marginTop: 4 },
  totalUnit: { color: C.textDim, fontSize: 14, fontWeight: "500" },
  previewRight: { alignItems: "flex-end" },
  previewLabel: { color: C.textMute, fontSize: 10.5, letterSpacing: 0.5, textTransform: "uppercase" },
  previewValue: { color: C.ok, fontSize: 18, fontWeight: "700", marginTop: 4 },
  previewRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  previewCell: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  previewCellLabel: { color: C.textMute, fontSize: 10.5, letterSpacing: 0.4, textTransform: "uppercase" },
  previewCellValue: { color: C.text, fontSize: 16, fontWeight: "700", marginTop: 4 },
  previewCellUnit: { color: C.textMute, fontSize: 11 },
  save: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: C.accent,
  },
  saveOk: { backgroundColor: C.ok },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.6)" },
  modal: { position: "absolute", left: 20, right: 20, top: "35%", backgroundColor: "#0E141C", borderRadius: 18, padding: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.14)" },
  modalTitle: { color: "#F1F5F9", fontSize: 16, fontWeight: "700" },
  cancel: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", alignItems: "center", backgroundColor: "rgba(255,255,255,0.04)" },
  cancelLabel: { color: "#F1F5F9", fontWeight: "600" },
  confirm: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: "#3DA9FF", alignItems: "center" },
  confirmLabel: { color: "#04111E", fontWeight: "700" },
  saveLabel: { color: "#04111E", fontWeight: "700", fontSize: 15 },
});
