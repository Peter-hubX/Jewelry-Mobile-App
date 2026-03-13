// components/AmbientBackground.tsx
// Full-screen ambient glow layer.  Zero external deps — pure LinearGradient + Views.
// Purple + gold orbs on near-black = luxury editorial feel.

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';

const { width: W, height: H } = Dimensions.get('window');

export function AmbientBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Base colour */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.bg }]} />

      {/* Top-right gold orb */}
      <View style={[styles.orb, {
        width: W * 0.75, height: W * 0.75,
        top: -W * 0.22, right: -W * 0.22,
        backgroundColor: Colors.orbGold,
        borderRadius: W,
      }]} />

      {/* Left-centre purple orb */}
      <View style={[styles.orb, {
        width: W * 0.85, height: W * 0.85,
        top: H * 0.28, left: -W * 0.35,
        backgroundColor: Colors.orbPurple,
        borderRadius: W,
      }]} />

      {/* Bottom-right warm rose orb */}
      <View style={[styles.orb, {
        width: W * 0.6, height: W * 0.6,
        bottom: H * 0.02, right: -W * 0.20,
        backgroundColor: Colors.orbRose,
        borderRadius: W,
      }]} />

      {/* Top gradient shimmer line */}
      <LinearGradient
        colors={['rgba(200,149,44,0.07)', 'transparent']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 220 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  orb: { position: 'absolute', opacity: 0.65 },
});
