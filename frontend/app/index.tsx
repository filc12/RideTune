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
import { calcSetup, calcSetupById, deriveMode, getLoad, saveLoad, type Load } from "@/src/utils/suspension";
import { BIKES, BIKE_BY_ID, BIKE_CATEGORIES, type Bike } from "@/src/data/bikes";

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
      const found = BIKE_BY_ID[id];
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
    const presets: Record<LoadMode, Pick<Load, "passenger" | "luggage">> = {
      solo:      { passenger: 0,  luggage: 0  },
      malas:     { passenger: 0,  luggage: 20 },
      duo:       { passenger: 65, luggage: 0  },
      duo_malas: { passenger: 65, luggage: 20 },
    };
    const next: Load = { ...load, ...presets[m] };
    setLoad(next);
    await saveLoad(next);
  }, [load]);

  const mode: LoadMode = deriveMode(load);
  const setup = calcSetupById(bike?.id ?? null, load);

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
                  {setup.noData && <NoDataBadge />}
                  <SuspensionBlock title={t("card.front")} icon="arrow-up-bold-circle-outline" values={setup.front} adj={setup.adjDetails?.front} t={t} />
                  <View style={styles.hairline} />
                  <SuspensionBlock title={t("card.rear")} icon="arrow-down-bold-circle-outline" values={setup.rear} adj={setup.adjDetails?.rear} t={t} />
                  <View style={styles.hairline} />
                  <View style={styles.sagRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.metricLabel}>{t("card.sag")}</Text>
                      <Text style={styles.sagValue}>{setup.sag} mm</Text>
                    </View>
                    {(() => {
                      const sagOk = setup.sag >= 20 && setup.sag <= 50;
                      const color = sagOk ? C.ok : C.warn;
                      const bg    = sagOk ? C.okSoft : C.warnSoft;
                      const bc    = sagOk ? "rgba(34,208,138,0.35)" : "rgba(244,178,62,0.35)";
                      const label = sagOk ? t("card.sag.ok" as never) : t("card.sag.warn" as never);
                      return (
                        <View style={[styles.sagBadge, { backgroundColor: bg, borderColor: bc }]}>
                          <View style={[styles.dot, { backgroundColor: color }]} />
                          <Text style={[styles.sagBadgeLabel, { color }]}>{label}</Text>
                        </View>
                      );
                    })()}
                  </View>
                  <CountNote profileId={setup.mfzProfileId} frontVType={setup.frontVType} rearVType={setup.rearVType} />
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

function getVType(s) {
  if (!s) return undefined;
  if (s.indexOf('mm') >= 0) return 'mm';
  if (s.indexOf('turns') >= 0) return s.indexOf('hard') >= 0 ? 'tu_hard' : 'tu_soft';
  return s.indexOf('hard') >= 0 ? 'cl_hard' : 'cl_soft';
}
function getNum(s, fallback) {
  if (!s) return String(fallback);
  const m = s.match(/^[0-9.]+/);
  return m ? m[0] : String(fallback);
}
function SuspensionBlock({
  title, icon, values, adj, t,
}: {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  values: { preload: number; rebound: number; compression: number };
  adj?: { preload: string; comp: string; reb: string; hsComp?: string };
  t: (k: never) => string;
}) {
  return (
    <View style={styles.suspBlock}>
      <View style={styles.suspHeader}>
        <MaterialCommunityIcons name={icon} size={14} color={C.accent} />
        <Text style={styles.suspTitle}>{title}</Text>
      </View>
      <View style={styles.suspGrid}>
        <DataCell label={t("card.preload" as never)} value={getNum(adj?.preload, values.preload)} vtype={getVType(adj?.preload)} t={t} />
        <DataCell label={t("card.rebound" as never)} value={getNum(adj?.reb, values.rebound)} vtype={getVType(adj?.reb)} t={t} />
        <DataCell label={t("card.compression" as never)} value={getNum(adj?.comp, values.compression)} vtype={getVType(adj?.comp)} t={t} />
      </View>
    </View>
  );
}
function CountNote({ profileId, frontVType, rearVType }: { profileId?: string; frontVType?: string; rearVType?: string }) {
  const { t } = useT();
  if (!frontVType && !rearVType && !profileId) return null;
  const modelKey = profileId ? `count.${profileId}` : null;
  const modelNote = modelKey ? t(modelKey as never) : null;
  const hasModelNote = modelNote && !modelNote.startsWith("count.");
  const frontDir = frontVType && frontVType !== "na" ? t(`susp.dir.${frontVType}` as never) : null;
  const rearDir  = rearVType  && rearVType  !== "na" ? t(`susp.dir.${rearVType}`  as never) : null;
  const sameDir  = frontDir && rearDir && frontDir === rearDir;
  return (
    <View style={{ marginTop: 12, padding: 12, borderRadius: 12, backgroundColor: "rgba(61,169,255,0.07)", borderWidth: 1, borderColor: "rgba(61,169,255,0.16)", gap: 6 }}>
      <Text style={{ color: "#3DA9FF", fontSize: 10, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase" }}>{t("card.how_to_set" as never)}</Text>
      {hasModelNote && <Text style={{ color: "#CBD5E1", fontSize: 11.5, lineHeight: 17 }}>{modelNote}</Text>}
      {!hasModelNote && sameDir && <Text style={{ color: "#94A3B8", fontSize: 11.5, lineHeight: 17 }}>{frontDir}</Text>}
      {!hasModelNote && !sameDir && frontDir && <Text style={{ color: "#94A3B8", fontSize: 11.5, lineHeight: 17 }}>🔵 {t("susp.dir.label.front" as never)}: {frontDir}</Text>}
      {!hasModelNote && !sameDir && rearDir  && <Text style={{ color: "#94A3B8", fontSize: 11.5, lineHeight: 17, marginTop: 2 }}>🔴 {t("susp.dir.label.rear" as never)}: {rearDir}</Text>}
    </View>
  );
}

function NoDataBadge() {
  const { t } = useT();
  return (
    <View style={{ padding: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", alignItems: "center", marginTop: 8, gap: 4 }}>
      <Text style={{ color: "#64748B", fontSize: 11, fontWeight: "700", letterSpacing: 0.4, textTransform: "uppercase" }}>{t("card.nodata.title" as never)}</Text>
      <Text style={{ color: "#475569", fontSize: 11, textAlign: "center" }}>{t("card.nodata.sub" as never)}</Text>
    </View>
  );
}
function DataCell({ label, value, vtype, t }: { label: string; value: string; vtype?: string; t?: (k: never) => string }) {
  const unit = vtype && t ? t(("susp.unit." + vtype) as never) : undefined;
  return (
    <View style={styles.dataCell}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={styles.dataValue}>{value}</Text>
      {unit ? <Text style={styles.dataUnit}>{unit}</Text> : null}
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
  const [step, setStep] = React.useState<"cat" | "brand" | "model">("cat");
  const [selCat, setSelCat] = React.useState<string | null>(null);
  const [selBrand, setSelBrand] = React.useState<string | null>(null);

  const reset = () => { setStep("cat"); setSelCat(null); setSelBrand(null); };
  const handleClose = () => { reset(); onClose(); };
  const handlePick = (b: Bike) => { reset(); onPick(b); };

  const brandsInCat = selCat
    ? [...new Set(BIKES.filter((b) => b.category === selCat).map((b) => b.brand))].sort()
    : [];
  const modelsInBrandCat = selCat && selBrand
    ? BIKES.filter((b) => b.category === selCat && b.brand === selBrand)
    : [];

  const stepTitle =
    step === "cat"   ? t("picker.title" as never) :
    step === "brand" ? t(`bike.cat.${selCat}` as never) :
    selBrand ?? "";

  return (
    <Modal visible={open} animationType="slide" transparent onRequestClose={handleClose}>
      <Pressable style={styles.modalBackdrop} onPress={handleClose} />
      <View style={styles.sheet} testID="bike-picker">
        <View style={styles.sheetHandle} />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 }}>
          {step !== "cat" && (
            <TouchableOpacity onPress={() => setStep(step === "model" ? "brand" : "cat")} style={{ padding: 4, marginLeft: -4 }}>
              <Ionicons name="chevron-back" size={20} color={C.accent} />
            </TouchableOpacity>
          )}
          <Text style={styles.sheetTitle}>{stepTitle}</Text>
        </View>
        <Text style={styles.sheetSub}>
          {step === "cat"   ? t("picker.sub" as never) :
           step === "brand" ? `${brandsInCat.length} marcas disponíveis` :
           `${modelsInBrandCat.length} ${modelsInBrandCat.length === 1 ? "modelo" : "modelos"}`}
        </Text>
        <ScrollView style={{ maxHeight: 540 }} showsVerticalScrollIndicator={false}>
          {step === "cat" && BIKE_CATEGORIES.map((cat) => {
            const count = BIKES.filter((b) => b.category === cat).length;
            if (count === 0) return null;
            return (
              <TouchableOpacity key={cat} activeOpacity={0.85} style={styles.bikeRow}
                onPress={() => { setSelCat(cat); setStep("brand"); }}>
                <View style={styles.bikeIcon}>
                  <MaterialCommunityIcons name="motorbike" size={22} color={C.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bikeBrand}>{t(`bike.cat.${cat}` as never)}</Text>
                  <Text style={styles.bikeModel}>{count} motos</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={C.textMute} />
              </TouchableOpacity>
            );
          })}
          {step === "brand" && brandsInCat.map((brand) => {
            const count = BIKES.filter((b) => b.category === selCat && b.brand === brand).length;
            return (
              <TouchableOpacity key={brand} activeOpacity={0.85} style={styles.bikeRow}
                onPress={() => { setSelBrand(brand); setStep("model"); }}>
                <View style={styles.bikeIcon}>
                  <MaterialCommunityIcons name="motorbike" size={22} color={C.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bikeBrand}>{brand}</Text>
                  <Text style={styles.bikeModel}>{count} {count === 1 ? "modelo" : "modelos"}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={C.textMute} />
              </TouchableOpacity>
            );
          })}
          {step === "model" && modelsInBrandCat.map((b) => {
            const active = b.id === selectedId;
            return (
              <TouchableOpacity key={b.id} activeOpacity={0.85} onPress={() => handlePick(b)}
                style={[styles.bikeRow, active && styles.bikeRowActive]} testID={`bike-${b.id}`}>
                <View style={styles.bikeIcon}>
                  <MaterialCommunityIcons name="motorbike" size={22} color={C.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bikeBrand}>{b.model}</Text>
                  <Text style={styles.bikeModel}>{b.cc}</Text>
                </View>
                {active
                  ? <Ionicons name="checkmark-circle" size={20} color={C.ok} />
                  : <Ionicons name="chevron-forward" size={18} color={C.textMute} />}
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
  cardTitle: { color: C.text, fontSize: 15, fontWeight: "700", marginTop: 4, maxWidth: 220 },
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
  dataCell: { flex: 1, paddingVertical: 6, paddingHorizontal: 8, backgroundColor: "rgba(255,255,255,0.025)", borderRadius: 10, borderWidth: 1, borderColor: C.border },
  dataLabel: { color: C.textMute, fontSize: 9.5, letterSpacing: 0.3, textTransform: "uppercase" },
  dataValueRow: { flexDirection: "row", alignItems: "baseline", marginTop: 4 },
  dataValue: { color: C.text, fontSize: 15, fontWeight: "700" },
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
  sheetTitle: { color: C.text, fontSize: 15, fontWeight: "700" },
  sheetSub: { color: C.textDim, fontSize: 13, marginTop: 4, marginBottom: 16 },
  bikeRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, marginBottom: 8 },
  bikeRowActive: { borderColor: "rgba(34,208,138,0.45)", backgroundColor: C.okSoft },
  bikeIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: C.accentSoft, alignItems: "center", justifyContent: "center" },
  bikeBrand: { color: C.text, fontWeight: "700", fontSize: 14 },
  bikeModel: { color: C.textDim, fontSize: 12, marginTop: 2 },
  catHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 14, marginBottom: 8, paddingHorizontal: 2 },
  catLabel: { color: C.accent, fontSize: 10.5, fontWeight: "800", letterSpacing: 1.6, textTransform: "uppercase" },
  catLine: { flex: 1, height: 1, backgroundColor: C.border },
  catCount: { color: C.textMute, fontSize: 11, fontWeight: "700", letterSpacing: 0.4 },
});
