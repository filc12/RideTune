/**
 * ConfidenceBadge.tsx
 * Visual indicator of data quality for suspension recommendations.
 *
 * Usage (compact pill, for result headers):
 *   <ConfidenceBadge level={result.confidence} compact />
 *
 * Usage (full card, for detail screens):
 *   <ConfidenceBadge level={result.confidence} />
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ConfidenceLevel } from '@/src/utils/suspensionReal';
import { useT } from '@/src/i18n';

type Config = {
  bg: string;
  border: string;
  accent: string;
};

const CONFIG: Record<ConfidenceLevel, Config> = {
  real_oem: {
    bg: 'rgba(34, 197, 94, 0.10)',
    border: 'rgba(34, 197, 94, 0.30)',
    accent: '#22c55e',
  },
  real_mfz: {
    bg: 'rgba(59, 130, 246, 0.10)',
    border: 'rgba(59, 130, 246, 0.30)',
    accent: '#60a5fa',
  },
  brand_formula: {
    bg: 'rgba(251, 191, 36, 0.10)',
    border: 'rgba(251, 191, 36, 0.30)',
    accent: '#fbbf24',
  },
  category_estimate: {
    bg: 'rgba(156, 163, 175, 0.10)',
    border: 'rgba(156, 163, 175, 0.25)',
    accent: '#9ca3af',
  },
};

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  compact?: boolean;
}

export function ConfidenceBadge({ level, compact = false }: ConfidenceBadgeProps) {
  const { t } = useT();
  const cfg = CONFIG[level];
  const label = t(`confidence.${level}.label` as never);
  const sublabel = t(`confidence.${level}.sub` as never);

  if (compact) {
    return (
      <View style={[styles.compact, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
        <View style={[styles.dot, { backgroundColor: cfg.accent }]} />
        <Text style={[styles.compactLabel, { color: cfg.accent }]}>{label}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.full, { backgroundColor: cfg.bg, borderColor: cfg.border, borderLeftColor: cfg.accent }]}>
      <View style={styles.header}>
        <View style={[styles.dot, { backgroundColor: cfg.accent }]} />
        <Text style={[styles.label, { color: cfg.accent }]}>{label}</Text>
      </View>
      <Text style={[styles.sublabel, { color: cfg.accent }]}>{sublabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  compact: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
    gap: 6,
  },
  full: {
    borderRadius: 8,
    borderWidth: 1,
    borderLeftWidth: 3,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  compactLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  sublabel: {
    fontSize: 11,
    opacity: 0.75,
    marginLeft: 14,
  },
});
