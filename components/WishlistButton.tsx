// components/WishlistButton.tsx
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withSequence, withTiming,
} from 'react-native-reanimated';
import { useWishlistContext } from '@/context/WishlistContext';
import { Colors, Shadow } from '@/constants/theme';
import type { Product } from '@/types';

type Props = {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  withBg?: boolean;
};

export function WishlistButton({ product, size = 'md', withBg = false }: Props) {
  const { isWishlisted, toggle } = useWishlistContext();
  const active = isWishlisted(product.id);

  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  function handlePress() {
    scale.value = withSequence(
      withSpring(1.35, { damping: 6, stiffness: 300 }),
      withSpring(1.0,  { damping: 10, stiffness: 200 }),
    );
    toggle(product);
  }

  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 22 : 18;
  const btnSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;

  return (
    <Animated.View style={aStyle}>
      <Pressable
        onPress={handlePress}
        hitSlop={8}
        style={[
          styles.btn,
          withBg && styles.bg,
          { width: btnSize, height: btnSize, borderRadius: btnSize / 2 },
        ]}
      >
        {/* Heart SVG drawn purely with View borders */}
        <HeartIcon size={iconSize} filled={active} />
      </Pressable>
    </Animated.View>
  );
}

// Simple heart rendered without external icon library
function HeartIcon({ size, filled }: { size: number; filled: boolean }) {
  const color = filled ? Colors.gold : 'rgba(255,255,255,0.85)';
  const s = size;

  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
      {/* Two circles for heart top lobes */}
      <View style={[heartStyles.lobeLeft,  { width: s * 0.52, height: s * 0.52, borderRadius: s * 0.26, backgroundColor: color, top: 0, left: s * 0.02 }]} />
      <View style={[heartStyles.lobeRight, { width: s * 0.52, height: s * 0.52, borderRadius: s * 0.26, backgroundColor: color, top: 0, right: s * 0.02 }]} />
      {/* Diamond for bottom point */}
      <View style={[heartStyles.bottom, {
        width: s * 0.72, height: s * 0.72,
        backgroundColor: color,
        top: s * 0.18,
        transform: [{ rotate: '45deg' }],
        borderRadius: s * 0.06,
      }]} />
    </View>
  );
}

const heartStyles = StyleSheet.create({
  lobeLeft:  { position: 'absolute' },
  lobeRight: { position: 'absolute' },
  bottom:    { position: 'absolute' },
});

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bg: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    ...Shadow.card,
  },
});
