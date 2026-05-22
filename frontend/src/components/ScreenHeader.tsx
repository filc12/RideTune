import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export const C = {
  bg: "#070A0F",
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
  surface: "rgba(255,255,255,0.04)",
  surfaceHi: "rgba(255,255,255,0.07)",
  border: "rgba(255,255,255,0.08)",
  borderHi: "rgba(255,255,255,0.14)",
};

export function ScreenHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  const router = useRouter();
  return (
    <View style={s.header}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={s.back}
        activeOpacity={0.8}
        testID="header-back"
      >
        <Ionicons name="chevron-back" size={20} color={C.text} />
      </TouchableOpacity>
      <Text style={s.title}>{title}</Text>
      <View style={{ width: 36 }}>{right}</View>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  back: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: C.text, fontSize: 15, fontWeight: "700", letterSpacing: 0.3 },
});
