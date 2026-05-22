import React, { useCallback, useEffect, useState } from "react";
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
import { useFocusEffect, useRouter } from "expo-router";

import { storage } from "@/src/utils/storage";
import { useT } from "@/src/i18n";
import { calcSetup, deriveMode, getLoad, saveLoad, type Load } from "@/src/utils/suspension";

const C = {
  bg: "#070A0F",
  surface: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  borderHi: "rgba(255,255,255,0.14)",
  text: "#F1F5F9",
  textDim: "#94A3B8",
  textMute: "#64748B",
  accent: "#3DA9FF",
  accentSoft: "rgba(61,169,255,0.14)",
  accentLine: "rgba(61,169,255,0.35)",
  ok: "#22D08A",
  okSoft: "rgba(34,208,138,0.14)",
  warn: "#F4B23E",
  warnSoft: "rgba(244,178,62,0.14)",
};

type LoadMode = "solo" | "malas" | "duo" | "duo_malas";
type Bike = { id: string; brand: string; model: string; cc: string };

const BIKES: Bike[] = [
  { id: "bmw-1250-gs", brand: "BMW", model: "R 1250 GS", cc: "1254cc" },
  { id: "yamaha-tenere", brand: "Yamaha", model: "Ténéré 700", cc: "689cc" },
  { id: "ktm-890-adv", brand: "KTM", model: "890 Adventure", cc: "889cc" },
  { id: "honda-africa", brand: "Honda", model: "Africa Twin", cc: "1084cc" },
  { id: "ducati-multi", brand: "Ducati", model: "Multistrada V4", cc: "1158cc" },
];

const K_BIKE = "ridetune.bike";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useT();
  const [bike, setBike] = useState<Bike | null>(null);
  const [load, setLoad] = useState<Load>({ rider: 75, passenger: 0, luggage: 0 });
  const [pickerOpen, setPickerOpen] = useState(false);

  const refresh = useCallback(async () => {
    const id = await storage.getItem<string>(K_BIKE, "");
    if (id) {
      const found = BIKES.find((b) => b.id === id);
      if (found) setBike(found);
    }
    setLoad(await getLoad());
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const onPickBike = useCallback(async (b: Bike) => {
    setBike(b);
    await storage.setItem(K_BIKE, b.id);
    setPickerOpen(false);
  }, []);

  const onPickScenario = useCallback(async (m: LoadMode) => {
    const presets: Record<LoadMode, Load> = {
      solo: { rider: 75, passenger: 0, luggage: 0 },
      malas: { rider: 75, passenger: 0, luggage: 20 },
      duo: { rider: 75, passenger: 65, luggage: 0 },
      duo_malas: { rider: 75, passenger: 65, luggage: 20 },
    };
    const next = presets[m];
    setLoad(next);
    await saveLoad(next);
  }, []);

  const mode: LoadMode = deriveMode(load);
  const setup = calcSetup(load);

  const scenarios: { id: LoadMode; labelKey: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
    { id: "solo", labelKey: "scenario.solo", icon: "account" },
    { id: "malas", labelKey: "scenario.malas", icon: "bag-suitcase" },
    { id: "duo", labelKey: "scenario.duo", icon: "account-multiple" },
    { id: "duo_malas", labelKey: "scenario.duo_malas", icon: "account-multiple-plus" },
  ];

  return (
    <View style={styles.root} testID="home-screen">
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0B1220", "#070A0F", "#070A0F"]} style={StyleSheet.absoluteFill} />
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 + insets.bottom }} showsVerticalScrollIndicator={false}>
          {/* Header */}
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
              onPress={() => router.push("/settings" as never)}
              testID="settings-btn"
            >
              <Feather name="settings" size={16} color={C.textDim} />
            </TouchableOpacity>
          </View>

          {/* Hero */}
          <View style={styles.hero}>
            <Text style={styles.headline} testID="home-headline">
              {t("home.headline.l1")}{"\n"}
              <Text style={styles.headlineAccent}>{t("home.headline.l2")}</Text>
            </Text>
            <Text style={styles.subheadline}>{t("home.sub")}</Text>
          </View>

          {/* CTAs */}
          <View style={styles.ctaRow}>
            <TouchableOpacity
              onPress={() => setPickerOpen(true)}
              activeOpacity={0.9}
              style={styles.primaryCtaWrap}
              testID="cta-choose-bike"
            >
              <LinearGradient colors={["#4FB8FF", "#2E8BE6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.primaryCta}>
                <MaterialCommunityIcons name="motorbike" size={18} color="#04111E" />
                <Text style={styles.primaryCtaLabel}>{t("cta.choose_bike")}</Text>
                <Ionicons name="arrow-forward" size={16} color="#04111E" />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/how-it-works" as never)}
              activeOpacity={0.85}
              style={styles.secondaryCta}
              testID="cta-how-it-works"
            >
              <Text style={styles.secondaryCtaLabel}>{t("cta.how_it_works")}</Text>
            </TouchableOpacity>
          </View>

          {/* Dashboard card */}
          <View style={styles.card} testID="dashboard-card">
            <BlurView intensity={Platform.OS === "ios" ? 24 : 0} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.cardInner}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.kicker}>{t("card.kicker")}</Text>
                  <Text style={styles.cardTitle}>
                    {bike ? `${bike.brand} ${bike.model}` : t("card.no_bike")}
                  </Text>
                </View>
                <View style={[styles.badge, bike ? styles.badgeOk : styles.badgeWarn]}>
                  <View style={[styles.dot, { backgroundColor: bike ? C.ok : C.warn }]} />
                  <Text style={[styles.badgeLabel, { color: bike ? C.ok : C.warn }]}>
                    {bike ? t("card.active") : t("card.todo")}
                  </Text>
                </View>
              </View>

              <View style={styles.miniRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.metricLabel}>{t("card.load_mode")}</Text>
                  <Text style={[styles.metricValue, { color: bike ? C.text : C.textDim }]} numberOfLines={1}>
                    {t(`scenario.${mode}` as never)}
                  </Text>
                </View>
                <View style={styles.miniDivider} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.metricLabel}>{t("card.setup")}</Text>
                  <Text style={[styles.metricValue, { color: bike ? C.ok : C.textDim }]}>
                    {bike ? t("card.setup.ready") : t("card.setup.waiting")}
                  </Text>
                </View>
              </View>

              {!bike ? (
                <View style={styles.emptyWrap}>
                  <View style={styles.emptyIcon}>
                    <MaterialCommunityIcons name="motorbike" size={22} color={C.accent} />
                  </View>
                  <Text style={styles.emptyText}>{t("card.empty")}</Text>
                  <TouchableOpacity activeOpacity={0.85} onPress={() => setPickerOpen(true)} style={styles.emptyBtn} testID="empty-choose-bike">
                    <Text style={styles.emptyBtnLabel}>{t("cta.choose_bike")}</Text>
                    <Ionicons name="arrow-forward" size={14} color={C.accent} />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <SuspensionBlock title={t("card.front")} icon="arrow-up-bold-circle-outline" values={setup.front} t={t} />
                  <View style={styles.hairline} />
                  <SuspensionBlock title={t("card.rear")} icon="arrow-down-bold-circle-outline" values={setup.rear} t={t} />
                  <View style={styles.hairline} />
                  <View style={styles.sagRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.metricLabel}>{t("card.sag")}</Text>
                      <Text style={styles.sagValue}>{setup.sag} mm</Text>
                    </View>
                    <View style={styles.sagBadge}>
                      <View style={[styles.dot, { backgroundColor: C.ok }]} />
                      <Text style={styles.sagBadgeLabel}>{t("card.sag.ok")}</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Scenarios */}
          <SectionTitle title={t("section.scenarios")} />
          <View style={styles.chipsWrap}>
            {scenarios.map((m) => {
              const active = m.id === mode;
              return (
                <TouchableOpacity
                  key={m.id}
                  activeOpacity={0.85}
                  onPress={() => onPickScenario(m.id)}
                  style={[styles.chip, active && styles.chipActive]}
                  testID={`scenario-${m.id}`}
                >
                  <MaterialCommunityIcons name={m.icon} size={16} color={active ? C.ok : C.textDim} />
                  <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{t(m.labelKey as never)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Tools */}
          <SectionTitle title={t("section.tools")} />
          <View style={styles.featuresCol}>
            <FeatureCard icon="speedometer" title={t("tools.sag")} desc={t("tools.sag.desc")} onPress={() => router.push("/sag" as never)} testID="feature-sag" />
            <FeatureCard icon="stethoscope" title={t("tools.diag")} desc={t("tools.diag.desc")} onPress={() => router.push("/diagnostico" as never)} testID="feature-diagnostico" />
            <FeatureCard icon="content-save-cog-outline" title={t("tools.setups")} desc={t("tools.setups.desc")} onPress={() => router.push("/setups" as never)} testID="feature-setups" />
          </View>
        </ScrollView>

        <BottomNav insets={insets} active="home" />
      </SafeAreaView>

      <BikePicker open={pickerOpen} onClose={() => setPickerOpen(false)} onPick={onPickBike} selectedId={bike?.id} t={t} />
    </View>
  );
}

function SuspensionBlock({
  title, icon, values, t,
}: {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  values: { preload: number; rebound: number; compression: number };
  t: (k: never) => string;
}) {
  return (
    <View style={styles.suspBlock}>
      <View style={styles.suspHeader}>
        <MaterialCommunityIcons name={icon} size={14} color={C.accent} />
        <Text style={styles.suspTitle}>{title}</Text>
      </View>
      <View style={styles.suspGrid}>
        <DataCell label={t("card.preload" as never)} value={String(values.preload)} unit={t("common.clicks" as never)} />
        <DataCell label={t("card.rebound" as never)} value={String(values.rebound)} unit={t("common.clicks" as never)} />
        <DataCell label={t("card.compression" as never)} value={String(values.compression)} unit={t("common.clicks" as never)} />
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

function SectionTitle({ title }: { title: string }) {
  return (
    <View style={styles.sectionTitleWrap}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionLine} />
    </View>
  );
}

function FeatureCard({ icon, title, desc, onPress, testID }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; title: string; desc: string; onPress: () => void; testID?: string }) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.feature} onPress={onPress} testID={testID}>
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

function BottomNav({ insets, active }: { insets: { bottom: number }; active: "home" | "carga" | "diag" | "sag" }) {
  const router = useRouter();
  const { t } = useT();
  const items: { id: typeof active; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; href: string }[] = [
    { id: "home", label: t("nav.home"), icon: "home-variant", href: "/" },
    { id: "carga", label: t("nav.carga"), icon: "weight-kilogram", href: "/carga" },
    { id: "diag", label: t("nav.diag"), icon: "stethoscope", href: "/diagnostico" },
    { id: "sag", label: t("nav.sag"), icon: "speedometer", href: "/sag" },
  ];
  return (
    <View style={[styles.bottomNavWrap, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <BlurView intensity={Platform.OS === "ios" ? 40 : 0} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.bottomNavInner}>
        {items.map((it) => {
          const isActive = it.id === active;
          return (
            <Pressable
              key={it.id}
              style={styles.navItem}
              onPress={() => router.push(it.href as never)}
              testID={`nav-${it.id}`}
            >
              <MaterialCommunityIcons name={it.icon} size={22} color={isActive ? C.accent : C.textMute} />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{it.label}</Text>
              {isActive && <View style={styles.navActiveDot} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function BikePicker({ open, onClose, onPick, selectedId, t }: { open: boolean; onClose: () => void; onPick: (b: Bike) => void; selectedId?: string; t: (k: never) => string }) {
  return (
    <Modal visible={open} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose} />
      <View style={styles.sheet} testID="bike-picker">
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>{t("picker.title" as never)}</Text>
        <Text style={styles.sheetSub}>{t("picker.sub" as never)}</Text>
        <ScrollView style={{ maxHeight: 420 }}>
          {BIKES.map((b) => {
            const active = b.id === selectedId;
            return (
              <TouchableOpacity key={b.id} activeOpacity={0.85} onPress={() => onPick(b)} style={[styles.bikeRow, active && styles.bikeRowActive]} testID={`bike-${b.id}`}>
                <View style={styles.bikeIcon}>
                  <MaterialCommunityIcons name="motorbike" size={22} color={C.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bikeBrand}>{b.brand}</Text>
                  <Text style={styles.bikeModel}>{b.model} · {b.cc}</Text>
                </View>
                {active ? <Ionicons name="checkmark-circle" size={20} color={C.ok} /> : <Ionicons name="chevron-forward" size={18} color={C.textMute} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  glowTop: { position: "absolute", top: -160, right: -120, width: 360, height: 360, borderRadius: 200, backgroundColor: "rgba(61,169,255,0.18)", opacity: 0.7 },
  glowBottom: { position: "absolute", bottom: -200, left: -120, width: 360, height: 360, borderRadius: 200, backgroundColor: "rgba(34,208,138,0.07)" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 8, paddingBottom: 6 },
  logoWrap: { flexDirection: "row", alignItems: "center" },
  logoBar: { width: 3, height: 18, backgroundColor: C.accent, borderRadius: 2, marginRight: 10 },
  logoText: { color: C.text, fontSize: 20, fontWeight: "700", letterSpacing: 0.4 },
  logoTextAccent: { color: C.accent, fontWeight: "700" },
  settingsBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center" },
  hero: { paddingHorizontal: 20, marginTop: 22 },
  headline: { color: C.text, fontSize: 30, fontWeight: "800", lineHeight: 36, letterSpacing: -0.5 },
  headlineAccent: { color: C.accent },
  subheadline: { marginTop: 10, color: C.textDim, fontSize: 14.5, lineHeight: 21, maxWidth: 340 },
  ctaRow: { flexDirection: "row", gap: 10, paddingHorizontal: 20, marginTop: 22 },
  primaryCtaWrap: { flex: 1.4, borderRadius: 14, overflow: "hidden" },
  primaryCta: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 15, paddingHorizontal: 18 },
  primaryCtaLabel: { color: "#04111E", fontWeight: "700", fontSize: 15, letterSpacing: 0.2 },
  secondaryCta: { flex: 1, paddingVertical: 15, borderRadius: 14, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, alignItems: "center", justifyContent: "center" },
  secondaryCtaLabel: { color: C.text, fontWeight: "600", fontSize: 14 },
  card: { marginHorizontal: 20, marginTop: 24, borderRadius: 20, overflow: "hidden", backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  cardInner: { padding: 18 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  kicker: { color: C.accent, fontSize: 10, fontWeight: "700", letterSpacing: 1.8 },
  cardTitle: { color: C.text, fontSize: 18, fontWeight: "700", marginTop: 4, maxWidth: 220 },
  badge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  badgeOk: { borderColor: "rgba(34,208,138,0.35)", backgroundColor: C.okSoft },
  badgeWarn: { borderColor: "rgba(244,178,62,0.35)", backgroundColor: C.warnSoft },
  badgeLabel: { fontSize: 11, fontWeight: "600", letterSpacing: 0.2 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  miniRow: { flexDirection: "row", marginTop: 16, backgroundColor: "rgba(255,255,255,0.025)", borderRadius: 12, borderWidth: 1, borderColor: C.border, paddingVertical: 12, paddingHorizontal: 14, alignItems: "center" },
  miniDivider: { width: 1, height: 28, backgroundColor: C.border, marginHorizontal: 10 },
  metricLabel: { color: C.textMute, fontSize: 11, letterSpacing: 0.4, textTransform: "uppercase" },
  metricValue: { color: C.text, fontSize: 14, fontWeight: "600", marginTop: 3 },
  emptyWrap: { alignItems: "center", paddingVertical: 22, paddingHorizontal: 8 },
  emptyIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.accentSoft, borderWidth: 1, borderColor: C.accentLine, alignItems: "center", justifyContent: "center" },
  emptyText: { color: C.textDim, fontSize: 14, marginTop: 12 },
  emptyBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: C.accentLine, backgroundColor: C.accentSoft },
  emptyBtnLabel: { color: C.accent, fontWeight: "600", fontSize: 13 },
  hairline: { height: 1, backgroundColor: C.border, marginVertical: 14 },
  suspBlock: { marginTop: 16 },
  suspHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
  suspTitle: { color: C.textDim, fontSize: 12, fontWeight: "600", letterSpacing: 0.6, textTransform: "uppercase" },
  suspGrid: { flexDirection: "row", gap: 8 },
  dataCell: { flex: 1, paddingVertical: 10, paddingHorizontal: 10, backgroundColor: "rgba(255,255,255,0.025)", borderRadius: 10, borderWidth: 1, borderColor: C.border },
  dataLabel: { color: C.textMute, fontSize: 10.5, letterSpacing: 0.4, textTransform: "uppercase" },
  dataValueRow: { flexDirection: "row", alignItems: "baseline", marginTop: 4 },
  dataValue: { color: C.text, fontSize: 18, fontWeight: "700" },
  dataUnit: { color: C.textMute, fontSize: 11, fontWeight: "500" },
  sagRow: { flexDirection: "row", alignItems: "center" },
  sagValue: { color: C.text, fontSize: 22, fontWeight: "700", marginTop: 4 },
  sagBadge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: C.okSoft, borderWidth: 1, borderColor: "rgba(34,208,138,0.35)" },
  sagBadgeLabel: { color: C.ok, fontSize: 11, fontWeight: "600" },
  sectionTitleWrap: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, marginTop: 30, marginBottom: 12, gap: 12 },
  sectionTitle: { color: C.text, fontSize: 13, fontWeight: "700", letterSpacing: 1.6, textTransform: "uppercase" },
  sectionLine: { flex: 1, height: 1, backgroundColor: C.border },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 20 },
  chip: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  chipActive: { backgroundColor: C.okSoft, borderColor: "rgba(34,208,138,0.45)" },
  chipLabel: { color: C.textDim, fontSize: 13, fontWeight: "500" },
  chipLabelActive: { color: C.ok, fontWeight: "700" },
  featuresCol: { paddingHorizontal: 20, gap: 10 },
  feature: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  featureIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: C.accentSoft, borderWidth: 1, borderColor: C.accentLine, alignItems: "center", justifyContent: "center" },
  featureTitle: { color: C.text, fontSize: 14, fontWeight: "700" },
  featureDesc: { color: C.textMute, fontSize: 12, marginTop: 2 },
  bottomNavWrap: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: "rgba(7,10,15,0.85)", borderTopWidth: 1, borderTopColor: C.border, paddingTop: 10 },
  bottomNavInner: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingHorizontal: 8 },
  navItem: { alignItems: "center", justifyContent: "center", paddingVertical: 4, paddingHorizontal: 12 },
  navLabel: { color: C.textMute, fontSize: 11, marginTop: 4, fontWeight: "500" },
  navLabelActive: { color: C.accent, fontWeight: "700" },
  navActiveDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: C.accent, marginTop: 3 },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.6)" },
  sheet: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#0E141C", borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 28, borderTopWidth: 1, borderColor: C.borderHi },
  sheetHandle: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: C.borderHi, marginBottom: 14 },
  sheetTitle: { color: C.text, fontSize: 18, fontWeight: "700" },
  sheetSub: { color: C.textDim, fontSize: 13, marginTop: 4, marginBottom: 16 },
  bikeRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, marginBottom: 8 },
  bikeRowActive: { borderColor: "rgba(34,208,138,0.45)", backgroundColor: C.okSoft },
  bikeIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: C.accentSoft, alignItems: "center", justifyContent: "center" },
  bikeBrand: { color: C.text, fontWeight: "700", fontSize: 14 },
  bikeModel: { color: C.textDim, fontSize: 12, marginTop: 2 },
});
