import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { storage } from "@/src/utils/storage";

// ---------- Theme ----------
const C = {
  bg: "#070A0F",
  bg2: "#0B1018",
  surface: "rgba(255,255,255,0.04)",
  surfaceHi: "rgba(255,255,255,0.07)",
  border: "rgba(255,255,255,0.08)",
  borderHi: "rgba(255,255,255,0.14)",
  text: "#F1F5F9",
  textDim: "#94A3B8",
  textMute: "#64748B",
  accent: "#3DA9FF", // electric blue
  accentSoft: "rgba(61,169,255,0.14)",
  accentLine: "rgba(61,169,255,0.35)",
  ok: "#22D08A", // green for active/positive states only
  okSoft: "rgba(34,208,138,0.14)",
  warn: "#F4B23E",
  warnSoft: "rgba(244,178,62,0.14)",
};

// ---------- Data ----------
type LoadMode = "solo" | "malas" | "duo" | "duo_malas";
type Bike = { id: string; brand: string; model: string; cc: string };

const BIKES: Bike[] = [
  { id: "bmw-1250-gs", brand: "BMW", model: "R 1250 GS", cc: "1254cc" },
  { id: "yamaha-tenere", brand: "Yamaha", model: "Ténéré 700", cc: "689cc" },
  { id: "ktm-890-adv", brand: "KTM", model: "890 Adventure", cc: "889cc" },
  { id: "honda-africa", brand: "Honda", model: "Africa Twin", cc: "1084cc" },
  { id: "ducati-multi", brand: "Ducati", model: "Multistrada V4", cc: "1158cc" },
];

const LOAD_MODES: { id: LoadMode; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { id: "solo", label: "Solo", icon: "account" },
  { id: "malas", label: "Com malas", icon: "bag-suitcase" },
  { id: "duo", label: "2 pessoas", icon: "account-multiple" },
  { id: "duo_malas", label: "2 pessoas + malas", icon: "account-multiple-plus" },
];

const LOAD_LABEL: Record<LoadMode, string> = {
  solo: "Solo",
  malas: "Com malas",
  duo: "2 pessoas",
  duo_malas: "2 pessoas + malas",
};

// Mock suspension values per load mode (visual only, no recalculation logic)
const SETUP_BY_MODE: Record<LoadMode, {
  front: { preload: string; rebound: string; compression: string };
  rear: { preload: string; rebound: string; compression: string };
  sag: string;
}> = {
  solo: {
    front: { preload: "5", rebound: "10", compression: "12" },
    rear: { preload: "4", rebound: "9", compression: "11" },
    sag: "32 mm",
  },
  malas: {
    front: { preload: "6", rebound: "9", compression: "11" },
    rear: { preload: "7", rebound: "8", compression: "10" },
    sag: "34 mm",
  },
  duo: {
    front: { preload: "7", rebound: "8", compression: "10" },
    rear: { preload: "9", rebound: "7", compression: "9" },
    sag: "36 mm",
  },
  duo_malas: {
    front: { preload: "8", rebound: "7", compression: "9" },
    rear: { preload: "11", rebound: "6", compression: "8" },
    sag: "38 mm",
  },
};

// ---------- Storage keys ----------
const K_BIKE = "ridetune.bike";
const K_LOAD = "ridetune.loadMode";

// ---------- Screen ----------
export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [bike, setBike] = useState<Bike | null>(null);
  const [loadMode, setLoadMode] = useState<LoadMode>("solo");
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const storedBikeId = await storage.getItem<string>(K_BIKE, "");
      const storedLoad = await storage.getItem<string>(K_LOAD, "solo");
      if (storedBikeId) {
        const found = BIKES.find((b) => b.id === storedBikeId);
        if (found) setBike(found);
      }
      if (storedLoad) setLoadMode(storedLoad as LoadMode);
    })();
  }, []);

  const onPickBike = useCallback(async (b: Bike) => {
    setBike(b);
    await storage.setItem(K_BIKE, b.id);
    setPickerOpen(false);
  }, []);

  const onPickLoad = useCallback(async (m: LoadMode) => {
    setLoadMode(m);
    await storage.setItem(K_LOAD, m);
  }, []);

  const setup = useMemo(() => SETUP_BY_MODE[loadMode], [loadMode]);

  return (
    <View style={styles.root} testID="home-screen">
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#0B1220", "#070A0F", "#070A0F"]}
        style={StyleSheet.absoluteFill}
      />
      {/* Ambient accent glow */}
      <View pointerEvents="none" style={styles.glowTop} />
      <View pointerEvents="none" style={styles.glowBottom} />

      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}
          showsVerticalScrollIndicator={false}
        >
          <Header />

          {/* Hero */}
          <View style={styles.hero}>
            <Text style={styles.headline} testID="home-headline">
              Afina a suspensão{"\n"}
              <Text style={styles.headlineAccent}>à tua carga real</Text>
            </Text>
            <Text style={styles.subheadline}>
              Escolhe a tua mota, adiciona peso, malas ou passageiro e recebe um ponto de partida seguro para o teu setup.
            </Text>
          </View>

          {/* CTAs */}
          <View style={styles.ctaRow}>
            <PrimaryCTA
              label="Escolher mota"
              icon="motorbike"
              onPress={() => setPickerOpen(true)}
              testID="cta-choose-bike"
            />
            <SecondaryCTA
              label="Como funciona"
              onPress={() => router.push("/how-it-works" as never)}
              testID="cta-how-it-works"
            />
          </View>

          {/* Dashboard card */}
          <DashboardCard
            bike={bike}
            loadMode={loadMode}
            setup={setup}
            onChooseBike={() => setPickerOpen(true)}
          />

          {/* Cenários rápidos */}
          <SectionTitle title="Cenários rápidos" />
          <View style={styles.chipsWrap}>
            {LOAD_MODES.map((m) => {
              const active = m.id === loadMode;
              return (
                <TouchableOpacity
                  key={m.id}
                  activeOpacity={0.85}
                  onPress={() => onPickLoad(m.id)}
                  style={[styles.chip, active && styles.chipActive]}
                  testID={`scenario-${m.id}`}
                >
                  <MaterialCommunityIcons
                    name={m.icon}
                    size={16}
                    color={active ? C.ok : C.textDim}
                  />
                  <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Feature cards */}
          <SectionTitle title="Ferramentas" />
          <View style={styles.featuresCol}>
            <FeatureCard
              icon="speedometer"
              title="Guia de Sag"
              desc="Mede o sag da tua mota passo a passo."
              testID="feature-sag"
            />
            <FeatureCard
              icon="stethoscope"
              title="Diagnóstico"
              desc="Identifica problemas de comportamento."
              testID="feature-diagnostico"
            />
            <FeatureCard
              icon="content-save-cog-outline"
              title="Setups guardados"
              desc="Recupera afinações para cada viagem."
              testID="feature-setups"
            />
          </View>
        </ScrollView>

        {/* Bottom nav */}
        <BottomNav insets={insets} />
      </SafeAreaView>

      <BikePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={onPickBike}
        selectedId={bike?.id}
      />
    </View>
  );
}

// ---------- Header ----------
function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.logoWrap} testID="ridetune-logo">
        <View style={styles.logoBar} />
        <Text style={styles.logoText}>
          Ride<Text style={styles.logoTextAccent}>Tune</Text>
        </Text>
      </View>
      <TouchableOpacity
        style={styles.settingsBtn}
        activeOpacity={0.7}
        testID="settings-btn"
      >
        <Feather name="settings" size={16} color={C.textDim} />
      </TouchableOpacity>
    </View>
  );
}

// ---------- CTAs ----------
function PrimaryCTA({
  label,
  icon,
  onPress,
  testID,
}: {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
  testID?: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={styles.primaryCtaWrap}
      testID={testID}
    >
      <LinearGradient
        colors={["#4FB8FF", "#2E8BE6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.primaryCta}
      >
        <MaterialCommunityIcons name={icon} size={18} color="#04111E" />
        <Text style={styles.primaryCtaLabel}>{label}</Text>
        <Ionicons name="arrow-forward" size={16} color="#04111E" />
      </LinearGradient>
    </TouchableOpacity>
  );
}

function SecondaryCTA({
  label,
  onPress,
  testID,
}: {
  label: string;
  onPress: () => void;
  testID?: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.secondaryCta}
      testID={testID}
    >
      <Text style={styles.secondaryCtaLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// ---------- Dashboard card ----------
function DashboardCard({
  bike,
  loadMode,
  setup,
  onChooseBike,
}: {
  bike: Bike | null;
  loadMode: LoadMode;
  setup: typeof SETUP_BY_MODE[LoadMode];
  onChooseBike: () => void;
}) {
  const hasBike = !!bike;
  return (
    <View style={styles.card} testID="dashboard-card">
      <BlurView intensity={Platform.OS === "ios" ? 24 : 0} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.cardInner}>
        {/* Card header */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.kicker}>SETUP ATUAL</Text>
            <Text style={styles.cardTitle}>
              {hasBike ? `${bike!.brand} ${bike!.model}` : "Sem mota selecionada"}
            </Text>
          </View>
          <StatusBadge ok={hasBike} />
        </View>

        {/* Load mode + Setup status row */}
        <View style={styles.miniRow}>
          <MiniMetric
            label="Modo de carga"
            value={LOAD_LABEL[loadMode]}
            active={hasBike}
          />
          <View style={styles.miniDivider} />
          <MiniMetric
            label="Setup"
            value={hasBike ? "Pronto" : "Aguarda mota"}
            active={hasBike}
            valueColor={hasBike ? C.ok : C.textDim}
          />
        </View>

        {/* Empty state */}
        {!hasBike ? (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIcon}>
              <MaterialCommunityIcons name="motorbike" size={22} color={C.accent} />
            </View>
            <Text style={styles.emptyText}>Ainda não escolheste uma mota.</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onChooseBike}
              style={styles.emptyBtn}
              testID="empty-choose-bike"
            >
              <Text style={styles.emptyBtnLabel}>Escolher mota</Text>
              <Ionicons name="arrow-forward" size={14} color={C.accent} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Front suspension */}
            <SuspensionBlock
              title="Suspensão frente"
              icon="arrow-up-bold-circle-outline"
              values={setup.front}
            />
            <View style={styles.hairline} />
            {/* Rear suspension */}
            <SuspensionBlock
              title="Suspensão trás"
              icon="arrow-down-bold-circle-outline"
              values={setup.rear}
            />
            <View style={styles.hairline} />
            {/* Sag row */}
            <View style={styles.sagRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.metricLabel}>Sag recomendado</Text>
                <Text style={styles.sagValue}>{setup.sag}</Text>
              </View>
              <View style={styles.sagBadge}>
                <View style={[styles.dot, { backgroundColor: C.ok }]} />
                <Text style={styles.sagBadgeLabel}>Dentro da gama</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <View style={[styles.badge, ok ? styles.badgeOk : styles.badgeWarn]}>
      <View style={[styles.dot, { backgroundColor: ok ? C.ok : C.warn }]} />
      <Text style={[styles.badgeLabel, { color: ok ? C.ok : C.warn }]}>
        {ok ? "Ativo" : "Por configurar"}
      </Text>
    </View>
  );
}

function MiniMetric({
  label,
  value,
  active,
  valueColor,
}: {
  label: string;
  value: string;
  active?: boolean;
  valueColor?: string;
}) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text
        style={[
          styles.metricValue,
          { color: valueColor || (active ? C.text : C.textDim) },
        ]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

function SuspensionBlock({
  title,
  icon,
  values,
}: {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  values: { preload: string; rebound: string; compression: string };
}) {
  return (
    <View style={styles.suspBlock}>
      <View style={styles.suspHeader}>
        <MaterialCommunityIcons name={icon} size={14} color={C.accent} />
        <Text style={styles.suspTitle}>{title}</Text>
      </View>
      <View style={styles.suspGrid}>
        <DataCell label="Preload" value={values.preload} unit="clks" />
        <DataCell label="Rebound" value={values.rebound} unit="clks" />
        <DataCell label="Compression" value={values.compression} unit="clks" />
      </View>
    </View>
  );
}

function DataCell({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <View style={styles.dataCell}>
      <Text style={styles.dataLabel}>{label}</Text>
      <View style={styles.dataValueRow}>
        <Text style={styles.dataValue}>{value}</Text>
        {unit ? <Text style={styles.dataUnit}> {unit}</Text> : null}
      </View>
    </View>
  );
}

// ---------- Sections ----------
function SectionTitle({ title }: { title: string }) {
  return (
    <View style={styles.sectionTitleWrap}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionLine} />
    </View>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  testID,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  desc: string;
  testID?: string;
}) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.feature} testID={testID}>
      <View style={styles.featureIcon}>
        <MaterialCommunityIcons name={icon} size={18} color={C.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={C.textMute} />
    </TouchableOpacity>
  );
}

// ---------- Bottom nav ----------
function BottomNav({ insets }: { insets: { bottom: number } }) {
  const items: {
    id: string;
    label: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    active?: boolean;
  }[] = [
    { id: "home", label: "Home", icon: "home-variant", active: true },
    { id: "carga", label: "Carga", icon: "weight-kilogram" },
    { id: "diagnostico", label: "Diagnóstico", icon: "stethoscope" },
    { id: "sag", label: "Sag", icon: "speedometer" },
  ];
  return (
    <View style={[styles.bottomNavWrap, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <BlurView intensity={Platform.OS === "ios" ? 40 : 0} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.bottomNavInner}>
        {items.map((it) => (
          <Pressable
            key={it.id}
            style={styles.navItem}
            testID={`nav-${it.id}`}
          >
            <MaterialCommunityIcons
              name={it.icon}
              size={22}
              color={it.active ? C.accent : C.textMute}
            />
            <Text style={[styles.navLabel, it.active && styles.navLabelActive]}>
              {it.label}
            </Text>
            {it.active && <View style={styles.navActiveDot} />}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ---------- Bike Picker Modal ----------
function BikePicker({
  open,
  onClose,
  onPick,
  selectedId,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (b: Bike) => void;
  selectedId?: string;
}) {
  return (
    <Modal visible={open} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose} />
      <View style={styles.sheet} testID="bike-picker">
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>Escolher mota</Text>
        <Text style={styles.sheetSub}>Seleciona o teu modelo para começar.</Text>
        <ScrollView style={{ maxHeight: 420 }}>
          {BIKES.map((b) => {
            const active = b.id === selectedId;
            return (
              <TouchableOpacity
                key={b.id}
                activeOpacity={0.85}
                onPress={() => onPick(b)}
                style={[styles.bikeRow, active && styles.bikeRowActive]}
                testID={`bike-${b.id}`}
              >
                <View style={styles.bikeIcon}>
                  <MaterialCommunityIcons name="motorbike" size={22} color={C.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bikeBrand}>{b.brand}</Text>
                  <Text style={styles.bikeModel}>{b.model} · {b.cc}</Text>
                </View>
                {active ? (
                  <Ionicons name="checkmark-circle" size={20} color={C.ok} />
                ) : (
                  <Ionicons name="chevron-forward" size={18} color={C.textMute} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  glowTop: {
    position: "absolute",
    top: -160,
    right: -120,
    width: 360,
    height: 360,
    borderRadius: 200,
    backgroundColor: "rgba(61,169,255,0.18)",
    opacity: 0.7,
  },
  glowBottom: {
    position: "absolute",
    bottom: -200,
    left: -120,
    width: 360,
    height: 360,
    borderRadius: 200,
    backgroundColor: "rgba(34,208,138,0.07)",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
  },
  logoWrap: { flexDirection: "row", alignItems: "center" },
  logoBar: {
    width: 3,
    height: 18,
    backgroundColor: C.accent,
    borderRadius: 2,
    marginRight: 10,
    shadowColor: C.accent,
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  logoText: {
    color: C.text,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  logoTextAccent: { color: C.accent, fontWeight: "700" },
  settingsBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },

  // Hero
  hero: { paddingHorizontal: 20, marginTop: 22 },
  headline: {
    color: C.text,
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  headlineAccent: { color: C.accent },
  subheadline: {
    marginTop: 10,
    color: C.textDim,
    fontSize: 14.5,
    lineHeight: 21,
    maxWidth: 340,
  },

  // CTAs
  ctaRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 22,
  },
  primaryCtaWrap: { flex: 1.4, borderRadius: 14, overflow: "hidden" },
  primaryCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
    paddingHorizontal: 18,
  },
  primaryCtaLabel: {
    color: "#04111E",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.2,
  },
  secondaryCta: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryCtaLabel: { color: C.text, fontWeight: "600", fontSize: 14 },

  // Card
  card: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  cardInner: { padding: 18 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  kicker: {
    color: C.accent,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.8,
  },
  cardTitle: {
    color: C.text,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
    maxWidth: 220,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeOk: { borderColor: "rgba(34,208,138,0.35)", backgroundColor: C.okSoft },
  badgeWarn: { borderColor: "rgba(244,178,62,0.35)", backgroundColor: C.warnSoft },
  badgeLabel: { fontSize: 11, fontWeight: "600", letterSpacing: 0.2 },
  dot: { width: 6, height: 6, borderRadius: 3 },

  miniRow: {
    flexDirection: "row",
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.025)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  miniDivider: { width: 1, height: 28, backgroundColor: C.border, marginHorizontal: 10 },
  metricLabel: {
    color: C.textMute,
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  metricValue: { color: C.text, fontSize: 14, fontWeight: "600", marginTop: 3 },

  // Empty state
  emptyWrap: {
    alignItems: "center",
    paddingVertical: 22,
    paddingHorizontal: 8,
  },
  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.accentSoft,
    borderWidth: 1,
    borderColor: C.accentLine,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: { color: C.textDim, fontSize: 14, marginTop: 12 },
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.accentLine,
    backgroundColor: C.accentSoft,
  },
  emptyBtnLabel: { color: C.accent, fontWeight: "600", fontSize: 13 },

  // Suspension
  hairline: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 14,
  },
  suspBlock: { marginTop: 16 },
  suspHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
  suspTitle: {
    color: C.textDim,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  suspGrid: { flexDirection: "row", gap: 8 },
  dataCell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.025)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  dataLabel: {
    color: C.textMute,
    fontSize: 10.5,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  dataValueRow: { flexDirection: "row", alignItems: "baseline", marginTop: 4 },
  dataValue: { color: C.text, fontSize: 18, fontWeight: "700" },
  dataUnit: { color: C.textMute, fontSize: 11, fontWeight: "500" },

  sagRow: { flexDirection: "row", alignItems: "center" },
  sagValue: { color: C.text, fontSize: 22, fontWeight: "700", marginTop: 4 },
  sagBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: C.okSoft,
    borderWidth: 1,
    borderColor: "rgba(34,208,138,0.35)",
  },
  sagBadgeLabel: { color: C.ok, fontSize: 11, fontWeight: "600" },

  // Sections
  sectionTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 12,
    gap: 12,
  },
  sectionTitle: {
    color: C.text,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  sectionLine: { flex: 1, height: 1, backgroundColor: C.border },

  // Chips
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 20,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  chipActive: {
    backgroundColor: C.okSoft,
    borderColor: "rgba(34,208,138,0.45)",
  },
  chipLabel: { color: C.textDim, fontSize: 13, fontWeight: "500" },
  chipLabelActive: { color: C.ok, fontWeight: "700" },

  // Features
  featuresCol: { paddingHorizontal: 20, gap: 10 },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 14,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  featureIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: C.accentSoft,
    borderWidth: 1,
    borderColor: C.accentLine,
    alignItems: "center",
    justifyContent: "center",
  },
  featureTitle: { color: C.text, fontSize: 14, fontWeight: "700" },
  featureDesc: { color: C.textMute, fontSize: 12, marginTop: 2 },

  // Bottom nav
  bottomNavWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(7,10,15,0.85)",
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 10,
  },
  bottomNavInner: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  navItem: { alignItems: "center", justifyContent: "center", paddingVertical: 4, paddingHorizontal: 12 },
  navLabel: { color: C.textMute, fontSize: 11, marginTop: 4, fontWeight: "500" },
  navLabelActive: { color: C.accent, fontWeight: "700" },
  navActiveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.accent,
    marginTop: 3,
    shadowColor: C.accent,
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },

  // Modal
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.6)" },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0E141C",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderColor: C.borderHi,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.borderHi,
    marginBottom: 14,
  },
  sheetTitle: { color: C.text, fontSize: 18, fontWeight: "700" },
  sheetSub: { color: C.textDim, fontSize: 13, marginTop: 4, marginBottom: 16 },
  bikeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 8,
  },
  bikeRowActive: { borderColor: "rgba(34,208,138,0.45)", backgroundColor: C.okSoft },
  bikeIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: C.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  bikeBrand: { color: C.text, fontWeight: "700", fontSize: 14 },
  bikeModel: { color: C.textDim, fontSize: 12, marginTop: 2 },
});
