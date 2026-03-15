// components/SkeletonCard.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withSequence, withTiming, Easing,
} from 'react-native-reanimated';
import { Colors, Radius, Spacing } from '@/constants/theme';

const { width: W } = Dimensions.get('window');
export const CARD_W = (W - Spacing.lg * 2 - Spacing.md) / 2;

const SHIMMER_BASE  = 'rgba(255,255,255,0.04)';
const SHIMMER_LIGHT = 'rgba(255,255,255,0.10)';

function ShimmerBox({ style }: { style: any }) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1,   { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, []);

  const aStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[style, aStyle]} />;
}

export function SkeletonCard({ index = 0 }: { index?: number }) {
  // Stagger the shimmer start per card so they don't all pulse together
  const delay = (index % 4) * 150;

  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) });
  }, []);
  const wrapStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.card, wrapStyle]}>
      {/* Image area */}
      <ShimmerBox style={styles.img} />

      {/* Karat badge */}
      <View style={styles.badgeWrap}>
        <ShimmerBox style={styles.badge} />
      </View>

      {/* Info area */}
      <View style={styles.info}>
        {/* Product name — two lines */}
        <ShimmerBox style={styles.nameLine1} />
        <ShimmerBox style={styles.nameLine2} />

        {/* Price row */}
        <View style={styles.metaRow}>
          <ShimmerBox style={styles.weight} />
          <ShimmerBox style={styles.price} />
        </View>
      </View>
    </Animated.View>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <View style={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    backgroundColor: Colors.glass,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
  },
  img: {
    width: CARD_W,
    height: CARD_W * 1.12,
    backgroundColor: SHIMMER_LIGHT,
  },
  badgeWrap: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
  },
  badge: {
    width: 32,
    height: 20,
    borderRadius: Radius.full,
    backgroundColor: SHIMMER_LIGHT,
  },
  info: {
    padding: Spacing.sm,
    paddingTop: 10,
    gap: 6,
  },
  nameLine1: {
    height: 12,
    borderRadius: 4,
    backgroundColor: SHIMMER_LIGHT,
    width: '90%',
    alignSelf: 'flex-end',
  },
  nameLine2: {
    height: 12,
    borderRadius: 4,
    backgroundColor: SHIMMER_BASE,
    width: '60%',
    alignSelf: 'flex-end',
  },
  metaRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  price: {
    height: 12,
    width: 70,
    borderRadius: 4,
    backgroundColor: SHIMMER_LIGHT,
  },
  weight: {
    height: 10,
    width: 30,
    borderRadius: 4,
    backgroundColor: SHIMMER_BASE,
  },
  grid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 100,
  },
});
