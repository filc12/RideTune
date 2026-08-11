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
import { BottomNav, useBottomNavClearance } from "@/src/components/BottomNav";
import { HapticButton } from "@/src/components/HapticButton";
import { useT } from "@/src/i18n";
import { storage } from "@/src/utils/storage";
import { getOemBikeById, getOemTirePressure, type TirePressure } from "@/src/services/oem-data";
import { useScreenView } from "@/src/hooks/useScreenView";
import type { Bike } from "@/src/data/bikes";

const K_BIKE = "ridetune.bike";

// bar → PSI (arredondado)
function barToPsi(bar: number): number {
  return Math.round(bar * 14.5038);
}

/**
 * A `source` de cada pressão é escrita em português, porque a investigação dos manuais
 * é feita em português. Mas este ecrã mostrava-a em bruto a toda a gente — um utilizador
 * inglês levava com um parágrafo português por baixo dos valores.
 *
 * Cada fonte tem duas partes separadas por travessão:
 *   «Manual do proprietário Ducati Panigale V4 (EN, 26 ED02), pág. 339 — estrada só piloto...»
 *    └─ cabeça: tipo de documento + nome, edição e página          └─ detalhe: prosa
 *
 * A cabeça é quase toda nomes próprios: traduz-se só a palavra do tipo e a abreviatura
 * de página, e fica legível em qualquer língua. O detalhe é que é prosa portuguesa, e
 * na esmagadora maioria dos casos repete os números que já estão no ecrã, por isso
 * mostra-se apenas em português. A ressalva que não se pode perder — a de o valor ainda
 * não estar confirmado — passa a ser uma linha própria e traduzida.
 */
// A ordem importa: «Valores do manual do proprietário …» tem de ser apanhado pela
// entrada de `derived` ANTES de qualquer coisa mais curta lhe comer só o princípio.
const TIPOS_FONTE: [RegExp, string][] = [
  [/^Valores do manual\s+(?:d[oae]s?\s+propriet[áa]rio\s+|d[oae]s?\s+|de\s+)?/i, "pneus.src.derived"],
  [/^Manual do propriet[áa]rio\s*/i, "pneus.src.owner"],
  [/^Manual do utilizador\s*/i,      "pneus.src.owner"],
  [/^Manual del propietario\s*/i,    "pneus.src.owner"],
  [/^Owner[’']s Handbook\s*/i,       "pneus.src.owner"],
  [/^Manual de oficina\s*/i,         "pneus.src.service"],
  [/^Manual de servi[çc]o\s*/i,      "pneus.src.service"],
  [/^Etiqueta\s*/i,                  "pneus.src.placard"],
  [/^Estimativa.*/i,                 "pneus.src.estimate"],
];

/** Palavras soltas que sobram na citação e que não são nomes próprios. */
const TERMOS_FONTE: [RegExp, string][] = [
  [/\bp[áa]g\./gi,   "pneus.src.page"],
  [/\bsec[çc][ãa]o\b/gi, "pneus.src.section"],
  [/\bc[óo]d\./gi,   "pneus.src.code"],
];

function fonteLegivel(
  source: string | null | undefined,
  dataQuality: string | null | undefined,
  lang: string,
  t: (k: never) => string,
): string {
  if (!source) return "";

  /**
   * O aviso de «por confirmar» aplica-se a TODAS as línguas.
   *
   * Até 11 de agosto de 2026 não era assim. O `return source` do português vinha antes
   * desta verificação, por isso quem tinha a app em português — o maior grupo de
   * utilizadores — via a fonte em bruto e nunca via a ressalva. Ficava a ler um número
   * de pressão com ar de facto, quando não estava confirmado em manual nenhum.
   *
   * Pressão de pneus é o único dado desta app onde estar errado magoa alguém: a menos
   * gera calor, e calor rebenta carcaças a velocidade de auto-estrada. A ressalva é
   * parte do dado, não um enfeite para estrangeiros.
   */
  const naoConfirmado = dataQuality !== "oem_manual";
  const aviso = naoConfirmado ? t("pneus.src.unconfirmed" as never) : "";
  const avisoUtil = aviso && !aviso.startsWith("pneus.") ? aviso : "";

  if (lang === "pt") {
    // Em português mostra-se a fonte inteira, como sempre — mas com o aviso colado,
    // e sem o repetir quando o próprio texto da fonte já o diz.
    if (!avisoUtil || /por confirmar/i.test(source)) return source;
    return `${source} — ${avisoUtil}`;
  }

  const cabeca = source.split("—")[0].trim();
  let texto = cabeca;
  for (const [re, chave] of TIPOS_FONTE) {
    if (re.test(cabeca)) {
      const resto = cabeca.replace(re, "").trim();
      const tipo = t(chave as never);
      texto = resto ? `${tipo}: ${resto}` : tipo;
      break;
    }
  }
  for (const [re, chave] of TERMOS_FONTE) {
    const palavra = t(chave as never);
    if (palavra && !palavra.startsWith("pneus.")) texto = texto.replace(re, palavra);
  }
  // «pág. 2-11 e 2-38» → o «e» é a única palavra que sobra entre números
  texto = texto.replace(/(\d)\s+e\s+(\d)/g, "$1, $2");

  if (avisoUtil) texto += ` — ${avisoUtil}`;
  return texto;
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
  const navPad = useBottomNavClearance();
  const { t, lang } = useT();
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

  useScreenView("pneus");

  useEffect(() => {
    load();
  }, [load]);

  const hasOffRoad = pressure?.frontOffRoadBar != null || pressure?.rearOffRoadBar != null;

  return (
    <View style={st.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0B1220", "#070A0F"]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScreenHeader title={t("pneus.title")} />

        <ScrollView
          contentContainerStyle={[st.scroll, { paddingBottom: navPad }]}
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

              {/* A que pneu se referem estas pressões.
                  Fora de estrada a pressão é do PNEU e não da mota: o manual da
                  Multistrada V4 Rally dá 1,6 bar, mas para o pneu de tacos, e a mota sai
                  de fábrica com um misto. Sem isto o número aparecia sem a condição — e a
                  ressalva que existia na fonte só se via em português, porque o texto é
                  cortado no primeiro travessão para as outras línguas.
                  O nome do pneu é nome próprio e é igual nas seis línguas. */}
              {mode === "offroad" && pressure.offroadTyre && (
                <View style={st.tyreNote}>
                  <MaterialCommunityIcons name="information-outline" size={16} color={C.warn} />
                  <Text style={st.tyreNoteTxt}>
                    {t("pneus.offroad_tyre")}: <Text style={st.tyreNoteName}>{pressure.offroadTyre}</Text>
                  </Text>
                </View>
              )}

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
                {t("pneus.source")}: {fonteLegivel(pressure.source, pressure.dataQuality, lang, t as never)}
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

  tyreNote:     { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 12, backgroundColor: "rgba(244,178,62,0.08)", borderWidth: 1, borderColor: "rgba(244,178,62,0.3)", marginTop: 12 },
  tyreNoteTxt:  { flex: 1, color: C.textDim, fontSize: 12, lineHeight: 17 },
  tyreNoteName: { color: C.warn, fontWeight: "700" },
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
