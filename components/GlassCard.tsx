// components/GlassCard.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Shadow } from '@/constants/theme';

type Variant = 'default' | 'gold' | 'dark' | 'purple';

const VARIANTS: Record<Variant, { bg: string; border: string }> = {
  default: { bg: Colors.glass,       border: Colors.glassBorder },
  gold:    { bg: Colors.glassGold,   border: Colors.glassGoldBorder },
  dark:    { bg: 'rgba(0,0,0,0.42)', border: Colors.border },
  purple:  { bg: 'rgba(45,27,94,0.28)', border: 'rgba(120,80,200,0.22)' },
};

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: Variant;
  noPadding?: boolean;
  radius?: number;
}

export function GlassCard({
  children, style, variant = 'default', noPadding, radius = Radius.lg,
}: Props) {
  const v = VARIANTS[variant];
  return (
    <View style={[
      styles.card,
      { backgroundColor: v.bg, borderColor: v.border, borderRadius: radius },
      !noPadding && styles.pad,
      Shadow.card,
      style,
    ]}>
      {/* Top inner highlight — simulates glass refraction */}
      <LinearGradient
        colors={['rgba(255,255,255,0.07)', 'transparent']}
        start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
        style={[styles.shimmer, { borderRadius: radius }]}
        pointerEvents="none"
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card:    { borderWidth: 1, overflow: 'hidden', position: 'relative' },
  pad:     { padding: 16 },
  shimmer: { position: 'absolute', top: 0, left: 0, right: 0, height: 56, zIndex: 0 },
});
