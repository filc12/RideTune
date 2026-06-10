import React from "react";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { C } from "@/src/components/ScreenHeader";
import { useT } from "@/src/i18n";

interface SwitchBikeModalProps {
  visible: boolean;
  fromLabel?: string;
  toLabel?: string;
  onSave: () => void;     // Guardar config (Premium) e trocar
  onDiscard: () => void;  // Trocar sem guardar
  onClose: () => void;    // Cancelar
}

export function SwitchBikeModal({
  visible, fromLabel, toLabel, onSave, onDiscard, onClose,
}: SwitchBikeModalProps) {
  const { t } = useT();

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={st.backdrop} onPress={onClose} />
      <View style={st.sheet}>
        <View style={st.iconWrap}>
          <MaterialCommunityIcons name="swap-horizontal-bold" size={34} color={C.accent} />
        </View>

        <Text style={st.title}>{t("switch.title")}</Text>

        {(fromLabel || toLabel) && (
          <View style={st.route}>
            <Text style={st.routeBike} numberOfLines={1}>{fromLabel}</Text>
            <MaterialCommunityIcons name="arrow-right" size={16} color={C.textMute} />
            <Text style={[st.routeBike, st.routeTo]} numberOfLines={1}>{toLabel}</Text>
          </View>
        )}

        <Text style={st.sub}>{t("switch.msg")}</Text>

        {/* Guardar config (Premium) */}
        <TouchableOpacity style={st.saveBtn} activeOpacity={0.85} onPress={onSave} testID="switch-save">
          <Text style={st.saveLabel}>{t("switch.save")}</Text>
        </TouchableOpacity>

        {/* Trocar sem guardar */}
        <TouchableOpacity style={st.discardBtn} activeOpacity={0.85} onPress={onDiscard} testID="switch-discard">
          <Text style={st.discardLabel}>{t("switch.discard")}</Text>
        </TouchableOpacity>

        {/* Cancelar */}
        <TouchableOpacity style={st.cancelBtn} activeOpacity={0.8} onPress={onClose} testID="switch-cancel">
          <Text style={st.cancelLabel}>{t("switch.cancel")}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const st = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.7)" },
  sheet: {
    position: "absolute", left: 20, right: 20, top: "22%",
    backgroundColor: "#0E141C", borderRadius: 20, padding: 24,
    borderWidth: 1, borderColor: "rgba(56,189,248,0.25)",
  },
  iconWrap: { alignItems: "center", marginBottom: 14 },
  title: { color: C.text, fontSize: 21, fontWeight: "800", textAlign: "center", letterSpacing: -0.3 },
  route: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, marginTop: 12,
  },
  routeBike: { color: "#94A3B8", fontSize: 13, fontWeight: "600", maxWidth: "42%" },
  routeTo: { color: C.accent },
  sub: { color: "#94A3B8", fontSize: 13.5, textAlign: "center", marginTop: 12, marginBottom: 22, lineHeight: 20 },
  saveBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 14, borderRadius: 14, backgroundColor: C.accent,
  },
  saveLabel: { color: "#04111E", fontWeight: "700", fontSize: 15, textAlign: "center", flexShrink: 1 },
  discardBtn: {
    alignItems: "center", justifyContent: "center",
    paddingVertical: 14, borderRadius: 14, marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: C.border,
  },
  discardLabel: { color: C.text, fontWeight: "600", fontSize: 14.5 },
  cancelBtn: { alignItems: "center", paddingVertical: 12, marginTop: 6 },
  cancelLabel: { color: "#64748B", fontSize: 13, fontWeight: "500" },
});
