import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { C } from "@/src/theme";
export { C };

export function ScreenHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  const router = useRouter();
  return (
    <View style={s.header}>
      <TouchableOpacity
        onPress={() => { if (router.canGoBack()) router.back(); else router.replace("/" as never); }}
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
