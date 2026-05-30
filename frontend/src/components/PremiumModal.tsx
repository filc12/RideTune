import React from "react";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { C } from "@/src/components/ScreenHeader";
import { useT } from "@/src/i18n";

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  feature?: string;
}

export function PremiumModal({ visible, onClose, feature }: PremiumModalProps) {
  const { t } = useT();
  const perks = [
    t("premium.perk.bikes"),
    t("premium.perk.loadmodes"),
    t("premium.perk.setups"),
    t("premium.perk.profiles"),
    t("premium.perk.languages"),
  ];
  // feature pode chegar como chave de tradução ou texto cru (legado em inglês)
  const featureText = feature
    ? (t(feature as never) !== feature ? t(feature as never) : feature)
    : null;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={st.backdrop} onPress={onClose} />
      <View style={st.sheet}>
        <View style={st.iconWrap}>
          <MaterialCommunityIcons name="star-circle" size={36} color={C.warn} />
        </View>
        <Text style={st.title}>{t("premium.title")}</Text>
        <Text style={st.sub}>
          {featureText
            ? t("premium.sub.feature").replace("{feature}", featureText)
            : t("premium.sub.generic")}
        </Text>
        <View style={st.perks}>
          {perks.map((p) => (
            <View key={p} style={st.perk}>
              <MaterialCommunityIcons name="check-circle" size={16} color={C.ok} />
              <Text style={st.perkText}>{p}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={st.upgradeBtn} activeOpacity={0.9} onPress={onClose}>
          <MaterialCommunityIcons name="star" size={16} color="#04111E" />
          <Text style={st.upgradeBtnLabel}>{t("premium.upgrade")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={st.laterBtn} activeOpacity={0.8} onPress={onClose}>
          <Text style={st.laterLabel}>{t("premium.later")}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const st = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.7)" },
  sheet: {
    position: "absolute", left: 20, right: 20, top: "18%",
    backgroundColor: "#0E141C", borderRadius: 20, padding: 24,
    borderWidth: 1, borderColor: "rgba(244,178,62,0.3)",
  },
  iconWrap: { alignItems: "center", marginBottom: 16 },
  title: { color: C.text, fontSize: 22, fontWeight: "800", textAlign: "center", letterSpacing: -0.3 },
  sub: { color: "#94A3B8", fontSize: 14, textAlign: "center", marginTop: 8, marginBottom: 20, lineHeight: 20 },
  perks: { gap: 10, marginBottom: 24 },
  perk: { flexDirection: "row", alignItems: "center", gap: 10 },
  perkText: { color: "#CBD5E1", fontSize: 13.5 },
  upgradeBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 15, borderRadius: 14, backgroundColor: C.warn,
  },
  upgradeBtnLabel: { color: "#04111E", fontWeight: "700", fontSize: 15 },
  laterBtn: { alignItems: "center", paddingVertical: 12, marginTop: 8 },
  laterLabel: { color: "#64748B", fontSize: 13, fontWeight: "500" },
});
