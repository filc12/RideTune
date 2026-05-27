import React, { useCallback, useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { C, ScreenHeader } from "@/src/components/ScreenHeader";
import { useT } from "@/src/i18n";
import { BottomNav } from "@/src/components/BottomNav";
import {
  listProfiles, saveProfile, updateProfile, deleteProfile,
  setActiveProfile, getActiveProfile, FREE_PROFILE_LIMIT,
  type RiderProfile,
} from "@/src/utils/profiles";
import { saveLoad, getLoad } from "@/src/utils/suspension";

export default function ProfilesScreen() {
  const { t } = useT();
  const router = useRouter();
  const [profiles, setProfiles] = useState<RiderProfile[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<RiderProfile | null>(null);
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("75");
  const [deleteTarget, setDeleteTarget] = useState<RiderProfile | null>(null);

  const load = useCallback(async () => {
    const all = await listProfiles();
    const active = await getActiveProfile();
    setProfiles(all);
    setActiveId(active?.id ?? "");
  }, []);

  useEffect(() => { load(); }, [load]);

  const onAdd = () => {
    setEditTarget(null);
    setName("");
    setWeight("75");
    setModalOpen(true);
  };

  const onEdit = (p: RiderProfile) => {
    setEditTarget(p);
    setName(p.name);
    setWeight(String(p.weightKg));
    setModalOpen(true);
  };

  const onSave = async () => {
    const w = parseInt(weight) || 75;
    const trimmed = name.trim() || "Rider";
    if (editTarget) {
      await updateProfile(editTarget.id, { name: trimmed, weightKg: w });
    } else {
      const np = await saveProfile({ name: trimmed, weightKg: w });
      // Apply weight to load
      const lo = await getLoad();
      await saveLoad({ ...lo, rider: w });
    }
    setModalOpen(false);
    load();
  };

  const onActivate = async (p: RiderProfile) => {
    await setActiveProfile(p.id);
    const lo = await getLoad();
    await saveLoad({ ...lo, rider: p.weightKg });
    setActiveId(p.id);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteProfile(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  const atLimit = profiles.length >= FREE_PROFILE_LIMIT;

  return (
    <View style={st.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0B1220", "#070A0F"]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScreenHeader title="Rider Profiles" />
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
          <Text style={st.sub}>Save your rider weight for quick setup loading.</Text>

          {atLimit && (
            <View style={st.limitBanner}>
              <MaterialCommunityIcons name="lock-outline" size={15} color={C.warn} />
              <Text style={st.limitText}>Free plan: 1 profile. Upgrade to Premium for unlimited profiles.</Text>
            </View>
          )}

          <TouchableOpacity
            style={[st.addBtn, atLimit && st.addBtnDisabled]}
            activeOpacity={atLimit ? 1 : 0.9}
            onPress={atLimit ? undefined : onAdd}
            testID="add-profile"
          >
            <Ionicons name="add-circle" size={18} color={atLimit ? C.textMute : "#04111E"} />
            <Text style={[st.addLabel, atLimit && { color: C.textMute }]}>Add profile</Text>
          </TouchableOpacity>

          {profiles.length === 0 ? (
            <View style={st.empty}>
              <MaterialCommunityIcons name="account-outline" size={28} color={C.textMute} />
              <Text style={st.emptyText}>No profiles yet.</Text>
            </View>
          ) : (
            <View style={{ marginTop: 18, gap: 10 }}>
              {profiles.map((p) => {
                const isActive = p.id === activeId;
                return (
                  <View key={p.id} style={[st.row, isActive && st.rowActive]} testID={`profile-${p.id}`}>
                    <View style={[st.avatar, isActive && st.avatarActive]}>
                      <Text style={[st.avatarText, isActive && { color: C.ok }]}>
                        {p.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={st.rowName}>{p.name}</Text>
                      <Text style={st.rowMeta}>{p.weightKg} kg</Text>
                    </View>
                    {!isActive && (
                      <TouchableOpacity onPress={() => onActivate(p)} style={st.activateBtn} testID={`activate-${p.id}`}>
                        <Ionicons name="checkmark-circle-outline" size={16} color={C.ok} />
                      </TouchableOpacity>
                    )}
                    {isActive && (
                      <View style={st.activeBadge}>
                        <Text style={st.activeBadgeText}>Active</Text>
                      </View>
                    )}
                    <TouchableOpacity onPress={() => onEdit(p)} style={st.editBtn}>
                      <Ionicons name="pencil-outline" size={16} color={C.textDim} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setDeleteTarget(p)} style={st.delBtn}>
                      <Ionicons name="trash-outline" size={16} color={C.warn} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
        <BottomNav active="home" />
      </SafeAreaView>

      {/* Add/Edit Modal */}
      <Modal transparent visible={modalOpen} animationType="fade" onRequestClose={() => setModalOpen(false)}>
        <Pressable style={st.backdrop} onPress={() => setModalOpen(false)} />
        <View style={st.modal}>
          <Text style={st.modalTitle}>{editTarget ? "Edit profile" : "New profile"}</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Name (e.g. Filipe)"
            placeholderTextColor={C.textMute}
            style={st.input}
            autoFocus
          />
          <TextInput
            value={weight}
            onChangeText={setWeight}
            placeholder="Weight with gear (kg)"
            placeholderTextColor={C.textMute}
            keyboardType="numeric"
            style={st.input}
          />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity onPress={() => setModalOpen(false)} style={st.cancel}>
              <Text style={st.cancelLabel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSave} style={st.confirm}>
              <Text style={st.confirmLabel}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Modal */}
      <Modal transparent visible={!!deleteTarget} animationType="fade" onRequestClose={() => setDeleteTarget(null)}>
        <Pressable style={st.backdrop} onPress={() => setDeleteTarget(null)} />
        <View style={st.modal}>
          <Text style={st.modalTitle}>Delete profile?</Text>
          <Text style={{ color: C.textDim, fontSize: 13, marginBottom: 20, marginTop: 8 }}>
            Delete <Text style={{ color: C.text, fontWeight: "700" }}>{deleteTarget?.name}</Text>?
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity onPress={() => setDeleteTarget(null)} style={st.cancel}>
              <Text style={st.cancelLabel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmDelete} style={[st.confirm, { backgroundColor: C.warn }]}>
              <Text style={[st.confirmLabel, { color: "#04111E" }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  sub: { color: C.textDim, fontSize: 14, marginBottom: 16 },
  limitBanner: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 12, backgroundColor: C.warnSoft, borderWidth: 1, borderColor: "rgba(244,178,62,0.3)", marginBottom: 14 },
  limitText: { color: C.warn, fontSize: 12, flex: 1 },
  addBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 14, backgroundColor: C.accent },
  addBtnDisabled: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  addLabel: { color: "#04111E", fontWeight: "700", fontSize: 14 },
  empty: { alignItems: "center", paddingVertical: 40, gap: 10 },
  emptyText: { color: C.textDim, fontSize: 13 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  rowActive: { borderColor: "rgba(34,208,138,0.45)", backgroundColor: C.okSoft },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.accentSoft, borderWidth: 1, borderColor: C.accentLine, alignItems: "center", justifyContent: "center" },
  avatarActive: { backgroundColor: "rgba(34,208,138,0.2)", borderColor: "rgba(34,208,138,0.4)" },
  avatarText: { color: C.accent, fontWeight: "700", fontSize: 16 },
  rowName: { color: C.text, fontWeight: "700", fontSize: 14 },
  rowMeta: { color: C.textMute, fontSize: 12, marginTop: 2 },
  activateBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(34,208,138,0.12)", borderWidth: 1, borderColor: "rgba(34,208,138,0.3)", alignItems: "center", justifyContent: "center" },
  activeBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: "rgba(34,208,138,0.15)", borderWidth: 1, borderColor: "rgba(34,208,138,0.35)" },
  activeBadgeText: { color: C.ok, fontSize: 11, fontWeight: "700" },
  editBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center", marginLeft: 4 },
  delBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.warnSoft, borderWidth: 1, borderColor: "rgba(244,178,62,0.3)", alignItems: "center", justifyContent: "center" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.6)" },
  modal: { position: "absolute", left: 20, right: 20, top: "30%", backgroundColor: "#0E141C", borderRadius: 18, padding: 20, borderWidth: 1, borderColor: C.borderHi },
  modalTitle: { color: C.text, fontSize: 16, fontWeight: "700", marginBottom: 14 },
  input: { marginBottom: 12, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, color: C.text, fontSize: 14 },
  cancel: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: C.border, alignItems: "center", backgroundColor: C.surface },
  cancelLabel: { color: C.text, fontWeight: "600" },
  confirm: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: C.accent, alignItems: "center" },
  confirmLabel: { color: "#04111E", fontWeight: "700" },
});
