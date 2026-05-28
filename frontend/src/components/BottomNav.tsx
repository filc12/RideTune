/**
 * BottomNav.tsx — shared bottom navigation bar.
 * Used on all main screens.
 */
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useT } from "@/src/i18n";
import { tapLight } from "@/src/utils/haptics";

const C = {
  bg: "#070A0F",
  border: "rgba(255,255,255,0.08)",
  text: "#F1F5F9",
  textMute: "#64748B",
  accent: "#3DA9FF",
};

export type NavActive = "home" | "carga" | "diag" | "sag";

export function BottomNav({ active }: { active: NavActive }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useT();

  const items: { id: NavActive; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; href: string }[] = [
    { id: "home",  label: t("nav.home"),  icon: "home-variant",     href: "/"            },
    { id: "carga", label: t("nav.carga"), icon: "weight-kilogram",  href: "/carga"       },
    { id: "diag",  label: t("nav.diag"),  icon: "stethoscope",      href: "/diagnostico" },
    { id: "sag",   label: t("nav.sag"),   icon: "speedometer",      href: "/sag"         },
  ];

  return (
    <View style={[st.wrap, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <BlurView intensity={Platform.OS === "ios" ? 40 : 0} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={st.inner}>
        {items.map((it) => {
          const isActive = it.id === active;
          return (
            <Pressable
              key={it.id}
              style={st.item}
              onPress={() => { tapLight(); if (!isActive) router.push(it.href as never); }}
              testID={`nav-${it.id}`}
            >
              <MaterialCommunityIcons name={it.icon} size={22} color={isActive ? C.accent : C.textMute} />
              <Text style={[st.label, isActive && st.labelActive]}>{it.label}</Text>
              {isActive && <View style={st.dot} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(7,10,15,0.85)",
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 10,
  },
  inner: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingHorizontal: 8 },
  item:  { alignItems: "center", justifyContent: "center", paddingVertical: 4, paddingHorizontal: 12 },
  label: { color: C.textMute, fontSize: 11, marginTop: 4, fontWeight: "500" },
  labelActive: { color: C.accent, fontWeight: "700" },
  dot:   { width: 4, height: 4, borderRadius: 2, backgroundColor: C.accent, marginTop: 3 },
});
