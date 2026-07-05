/**
 * pneus.tsx — Ecrã de Pressão de Pneus
 *
 * Mostra pressões OEM de fábrica (frente/trás, solo/carregado, estrada/off-road)
 * para a mota actualmente seleccionada.
 * Dados vêm do Supabase (via oem-data service), fallback para sem dados.
 */
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { C, ScreenHeader } from "@/src/components/ScreenHeader";
import { BottomNav } from "@/src/components/BottomNav";
import { HapticButton } from "@/src/components/HapticButton";
import { useT } from "@/src/i18n";
import { storage } from "@/src/utils/storage";
import { getOemBikeById, getOemTirePressure, type TirePressure } from "@/src/services/oem-data";
import { Analytics } from "@/src/services/analytics";
import type { Bike } from "@/src/data/bikes";

const K_BIKE = "ridetune.bike";

// bar → PSI (arredondado)
function barToPsi(bar: number): number {
  return Math.round(bar * 14.5038);
}

// ─── Componente de pressão individual ────────────────────────────────────────

type PressureCardProps = {
  label: string;
  soloBar: number;
  loadedBar: number | null;
  tLabel: (k: string) => string;
};

function PressureCard({ label, soloBar, loadedBar, tLabel }: PressureCardProps) {
  const t = tLabel;
  return (
    <View style={st.pressCard}>
      <Text style={st.pressCardLabel}>{label}</Text>
      <View style={st.pressRow}>
        <View style={st.pressItem}>
          <Text style={st.pressModeLabel}>{t("pneus.solo")}</Text>
          <Text style={st.pressValue}>{soloBar.toFixed(1)}</Text>
          <Text style={st.pressUnit}>{t("pneus.bar")}</Text>
          <Text style={st.pressPsi}>{barToPsi(soloBar)} {t("pneus.psi")}</Text>
        </View>
        {loadedBar !== null && (
          <View style={[st.pressItem, st.pressItemLoaded]}>
            <Text style={st.pressModeLabel}>{t("pneus.loaded")}</Text>
            <Text style={[st.pressValue, { color: C.warn }]}>{loadedBar.toFixed(1)}</Text>
            <Text style={st.pressUnit}>{t("pneus.bar")}</Text>
            <Text style={st.pressPsi}>{barToPsi(loadedBar)} {t("pneus.psi")}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Ecrã principal ───────────────────────────────────────────────────────────

type ModeTab = "road" | "offroad";

export default function PneusScreen() {
  const { t } = useT();
  const [bike, setBike] = useState<Bike | null>(null);
  const [pressure, setPressure] = useState<TirePressure | null>(null);
  const [mode, setMode] = useState<ModeTab>("road");

  const load = useCallback(async () => {
    const bikeId = await storage.getItem<string>(K_BIKE, "");
    if (!bikeId) return;
    const b = getOemBikeById(bikeId);
    if (b) setBike(b);
    const p = getOemTirePressure(bikeId);
    if (p) setPressure(p);
  }, []);

  useEffect(() => {
    load();
    Analytics.screenViewed({ screen: 'pneus' });
  }, [load]);

  const hasOffRoad = pressure?.frontOffRoadBar != null || pressure?.rearOffRoadBar != null;

  return (
    <View style={st.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0B1220", "#070A0F"]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScreenHeader title={t("pneus.title")} />

        <ScrollView
          contentContainerStyle={st.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Subtítulo */}
          <Text style={st.sub}>{t("pneus.sub")}</Text>

          {/* Sem mota seleccionada */}
          {!bike && (
            <View style={st.empty}>
              <MaterialCommunityIcons name="tire" size={36} color={C.textMute} />
              <Text style={st.emptyText}>{t("pneus.no_bike")}</Text>
            </View>
          )}

          {/* Mota seleccionada mas sem dados */}
          {bike && !pressure && (
            <View style={st.bikeCard}>
              <Text style={st.bikeCardName}>{bike.brand} {bike.model}</Text>
              <View style={st.empty}>
                <MaterialCommunityIcons name="information-outline" size={28} color={C.textMute} />
                <Text style={st.emptyText}>{t("pneus.no_data")}</Text>
              </View>
            </View>
          )}

          {/* Mota + dados */}
          {bike && pressure && (
            <>
              {/* Nome da mota */}
              <View style={st.bikeCard}>
                <MaterialCommunityIcons name="motorbike" size={20} color={C.accent} />
                <Text style={st.bikeCardName}>{bike.brand} {bike.model}</Text>
              </View>

              {/* Selector estrada / off-road (só se tiver off-road) */}
              {hasOffRoad && (
                <View style={st.modeTabs}>
                  <HapticButton
                    style={[st.modeTab, mode === "road" && st.modeTabActive]}
                    onPress={() => setMode("road")}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons
                      name="road"
                      size={16}
                      color={mode === "road" ? "#04111E" : C.textMute}
                    />
                    <Text style={[st.modeTabLabel, mode === "road" && st.modeTabLabelActive]}>
                      {t("pneus.road")}
                    </Text>
                  </HapticButton>
                  <HapticButton
                    style={[st.modeTab, mode === "offroad" && st.modeTabActive]}
                    onPress={() => setMode("offroad")}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons
                      name="terrain"
                      size={16}
                      color={mode === "offroad" ? "#04111E" : C.textMute}
                    />
                    <Text style={[st.modeTabLabel, mode === "offroad" && st.modeTabLabelActive]}>
                      {t("pneus.offroad")}
                    </Text>
                  </HapticButton>
                </View>
              )}

              {/* Pressões */}
              <View style={st.pressGrid}>
                {mode === "road" ? (
                  <>
                    <PressureCard
                      label={t("pneus.front")}
                      soloBar={pressure.frontSoloBar}
                      loadedBar={pressure.frontLoadedBar}
                      tLabel={t}
                    />
                    <PressureCard
                      label={t("pneus.rear")}
                      soloBar={pressure.rearSoloBar}
                      loadedBar={pressure.rearLoadedBar}
                      tLabel={t}
                    />
                  </>
                ) : (
                  <>
                    <PressureCard
                      label={t("pneus.front")}
                      soloBar={pressure.frontOffRoadBar ?? pressure.frontSoloBar}
                      loadedBar={null}
                      tLabel={t}
                    />
                    <PressureCard
                      label={t("pneus.rear")}
                      soloBar={pressure.rearOffRoadBar ?? pressure.rearSoloBar}
                      loadedBar={null}
                      tLabel={t}
                    />
                  </>
                )}
              </View>

              {/* Tamanho dos pneus */}
              {(pressure.frontSize || pressure.rearSize) && (
                <View style={st.sizeCard}>
                  <Text style={st.sizeTitle}>{t("pneus.tire_size")}</Text>
                  <View style={st.sizeRow}>
                    {pressure.frontSize && (
                      <View style={st.sizeItem}>
                        <Text style={st.sizeLabel}>{t("pneus.front")}</Text>
                        <Text style={st.sizeValue}>{pressure.frontSize}</Text>
                      </View>
                    )}
                    {pressure.rearSize && (
                      <View style={st.sizeItem}>
                        <Text style={st.sizeLabel}>{t("pneus.rear")}</Text>
                        <Text style={st.sizeValue}>{pressure.rearSize}</Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* Aviso pneu frio */}
              <View style={st.warnCard}>
                <Text style={st.warnText}>{t("pneus.cold_warn")}</Text>
              </View>

              {/* Fonte */}
              <Text style={st.sourceText}>
                {t("pneus.source")}: {pressure.source}
              </Text>
            </>
          )}
        </ScrollView>

        <BottomNav active="pneus" />
      </SafeAreaView>
    </View>
  );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const st = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 20, paddingBottom: 120, maxWidth: 600, alignSelf: "center", width: "100%" },
  sub:    { color: C.textDim, fontSize: 13, marginBottom: 20, lineHeight: 19 },

  empty:     { alignItems: "center", paddingVertical: 40, gap: 14 },
  emptyText: { color: C.textDim, fontSize: 14, textAlign: "center", lineHeight: 20 },

  bikeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.accentLine,
    marginBottom: 18,
  },
  bikeCardName: { color: C.text, fontSize: 15, fontWeight: "700", flex: 1 },

  modeTabs: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  modeTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  modeTabActive: {
    backgroundColor: C.accent,
    borderColor: C.accent,
  },
  modeTabLabel: { color: C.textMute, fontSize: 13, fontWeight: "600" },
  modeTabLabelActive: { color: "#04111E" },

  pressGrid: { gap: 12, marginBottom: 16 },
  pressCard: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  pressCardLabel: {
    color: C.accent,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
    marginBottom: 14,
  },
  pressRow:      { flexDirection: "row", gap: 12 },
  pressItem:     { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 12, backgroundColor: C.surfaceHi },
  pressItemLoaded: { borderWidth: 1, borderColor: "rgba(244,178,62,0.3)", backgroundColor: "rgba(244,178,62,0.06)" },
  pressModeLabel:{ color: C.textMute, fontSize: 11, fontWeight: "600", letterSpacing: 0.8, marginBottom: 6 },
  pressValue:    { color: C.text, fontSize: 32, fontWeight: "800", lineHeight: 36 },
  pressUnit:     { color: C.accent, fontSize: 13, fontWeight: "700" },
  pressPsi:      { color: C.textDim, fontSize: 11, marginTop: 4 },

  sizeCard: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 14,
  },
  sizeTitle: { color: C.textMute, fontSize: 11, fontWeight: "700", letterSpacing: 1.2, marginBottom: 12 },
  sizeRow:   { flexDirection: "row", gap: 12 },
  sizeItem:  { flex: 1, alignItems: "center", gap: 4 },
  sizeLabel: { color: C.textDim, fontSize: 11 },
  sizeValue: { color: C.text, fontSize: 14, fontWeight: "700", fontFamily: "monospace" },

  warnCard: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "rgba(244,178,62,0.08)",
    borderWidth: 1,
    borderColor: "rgba(244,178,62,0.25)",
    marginBottom: 14,
  },
  warnText: { color: C.warn, fontSize: 12.5, lineHeight: 18 },

  sourceText: { color: C.textMute, fontSize: 11, textAlign: "center", lineHeight: 16 },
});
