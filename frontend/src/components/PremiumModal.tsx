import React, { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { C } from "@/src/components/ScreenHeader";
import { useT } from "@/src/i18n";
import {
  getLifetimePrice,
  isBillingAvailable,
  purchaseLifetime,
  restorePurchases,
} from "@/src/services/purchases";

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  feature?: string;
  /** Chamado quando a compra (ou restore) desbloqueia o Premium. */
  onPurchased?: () => void;
}

export function PremiumModal({ visible, onClose, feature, onPurchased }: PremiumModalProps) {
  const { t } = useT();
  const [price, setPrice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const billing = isBillingAvailable();

  useEffect(() => {
    if (!visible || !billing) return;
    setError(null);
    getLifetimePrice().then(setPrice).catch(() => setPrice(null));
  }, [visible, billing]);

  const perks = [
    t("premium.lt.perk1"),
    t("premium.lt.perk2"),
    t("premium.lt.perk3"),
    t("premium.lt.perk4"),
    t("premium.lt.perk5"),
  ];
  // feature pode chegar como chave de tradução ou texto cru (legado em inglês)
  const featureText = feature
    ? (t(feature as never) !== feature ? t(feature as never) : feature)
    : null;

  const handleBuy = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    const result = await purchaseLifetime();
    setBusy(false);
    if (result === "purchased") {
      onPurchased?.();
      onClose();
    } else if (result === "error" || result === "unavailable") {
      setError(t("premium.error"));
    }
    // "cancelled": sem mensagem, o utilizador fechou o fluxo de propósito
  };

  const handleRestore = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    const restored = await restorePurchases();
    setBusy(false);
    if (restored) {
      onPurchased?.();
      onClose();
    } else {
      setError(t("premium.norestore"));
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={st.backdrop} onPress={onClose} />
      <View style={st.sheet}>
        <View style={st.iconWrap}>
          <MaterialCommunityIcons name="star-circle" size={36} color={C.warn} />
        </View>
        <Text style={st.title}>{t("premium.lt.title")}</Text>
        <Text style={st.slogan}>{t("premium.lt.slogan")}</Text>
        <Text style={st.valueLines}>{t("premium.lt.lines")}</Text>
        {featureText ? (
          <Text style={st.sub}>
            {t("premium.sub.feature").replace("{feature}", featureText)}
          </Text>
        ) : null}
        <View style={st.perks}>
          {perks.map((p) => (
            <View key={p} style={st.perk}>
              <MaterialCommunityIcons name="check-circle" size={16} color={C.ok} />
              <Text style={st.perkText}>{p}</Text>
            </View>
          ))}
        </View>

        {billing ? (
          <>
            <TouchableOpacity
              style={[st.upgradeBtn, busy && st.btnDisabled]}
              activeOpacity={0.85}
              onPress={handleBuy}
              disabled={busy}
            >
              {busy ? (
                <ActivityIndicator size="small" color="#04111E" />
              ) : (
                <>
                  <MaterialCommunityIcons name="star" size={16} color="#04111E" />
                  <Text style={st.upgradeBtnLabel}>
                    {price
                      ? t("premium.buy").replace("{price}", price)
                      : t("premium.buy.noprice")}
                  </Text>
                </>
              )}
            </TouchableOpacity>
            {error ? <Text style={st.errorText}>{error}</Text> : null}
            <TouchableOpacity style={st.restoreBtn} activeOpacity={0.7} onPress={handleRestore} disabled={busy}>
              <Text style={st.restoreLabel}>{t("premium.restore")}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={st.comingSoonBtn}>
            <MaterialCommunityIcons name="clock-outline" size={16} color={C.warn} />
            <Text style={st.comingSoonLabel}>{t("premium.comingsoon")}</Text>
          </View>
        )}

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
  title: { color: C.text, fontSize: 21, fontWeight: "800", textAlign: "center", letterSpacing: -0.3 },
  slogan: { color: "#4A9EFF", fontSize: 15, fontWeight: "700", textAlign: "center", marginTop: 6 },
  valueLines: { color: "#CBD5E1", fontSize: 13.5, textAlign: "center", marginTop: 12, marginBottom: 14, lineHeight: 21 },
  sub: { color: "#94A3B8", fontSize: 13, textAlign: "center", marginBottom: 12, lineHeight: 19 },
  perks: { gap: 10, marginBottom: 24 },
  perk: { flexDirection: "row", alignItems: "center", gap: 10 },
  perkText: { color: "#CBD5E1", fontSize: 13.5 },
  upgradeBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 15, borderRadius: 14, backgroundColor: C.warn,
  },
  upgradeBtnLabel: { color: "#04111E", fontWeight: "700", fontSize: 15 },
  btnDisabled: { opacity: 0.7 },
  lifetimeNote: { color: "#64748B", fontSize: 12, textAlign: "center", marginTop: 8 },
  errorText: { color: "#F87171", fontSize: 12.5, textAlign: "center", marginTop: 8 },
  restoreBtn: { alignItems: "center", paddingVertical: 10, marginTop: 4 },
  restoreLabel: { color: "#94A3B8", fontSize: 13, fontWeight: "600", textDecorationLine: "underline" },
  comingSoonBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 15, borderRadius: 14,
    backgroundColor: "rgba(244,178,62,0.12)", borderWidth: 1, borderColor: "rgba(244,178,62,0.35)",
  },
  comingSoonLabel: { color: C.warn, fontWeight: "700", fontSize: 15 },
  laterBtn: { alignItems: "center", paddingVertical: 12, marginTop: 8 },
  laterLabel: { color: "#64748B", fontSize: 13, fontWeight: "500" },
});
