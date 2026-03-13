// components/ProductCard.tsx
import React, { useEffect } from 'react';
import { StyleSheet, Text, Pressable, View, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withSpring, withDelay, Easing,
} from 'react-native-reanimated';
import { router } from 'expo-router';

import {
  Colors, Spacing, Radius, FontSize, Shadow, DEMO_IMAGES,
} from '@/constants/theme';
import {
  PRODUCT_TYPE_LABELS, PRODUCT_TYPE_ICONS, resolveImageUrl,
  type Product, type ProductType,
} from '@/types';
import { BASE_URL } from '@/services/api';

const { width: W } = Dimensions.get('window');
export const CARD_W = (W - Spacing.lg * 2 - Spacing.md) / 2;

// Fallback Unsplash images keyed by product type — all gold jewelry
const FALLBACK: Record<string, string> = {
  ring:     DEMO_IMAGES.ring,
  necklace: DEMO_IMAGES.necklace,
  bracelet: DEMO_IMAGES.bracelet,   // gold chain bracelet
  earrings: DEMO_IMAGES.earrings,
  bar:      DEMO_IMAGES.bar,
};

const AnimPressable = Animated.createAnimatedComponent(Pressable);

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const opacity = useSharedValue(0);
  const transY  = useSharedValue(28);
  const scale   = useSharedValue(1);

  useEffect(() => {
    const d = Math.min(index * 55, 380);
    opacity.value = withDelay(d, withTiming(1, { duration: 420, easing: Easing.out(Easing.quad) }));
    transY.value  = withDelay(d, withSpring(0, { damping: 16, stiffness: 160 }));
  }, []);

  const wrapStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: transY.value }, { scale: scale.value }],
  }));

  const imgUrl = resolveImageUrl(product.images, BASE_URL)
    ?? FALLBACK[product.productType ?? 'ring']
    ?? DEMO_IMAGES.ring;

  return (
    <AnimPressable
      style={[styles.card, wrapStyle]}
      onPress={() => router.push(`/product/${product.id}`)}
      onPressIn={() => { scale.value = withSpring(0.955, { damping: 18 }); }}
      onPressOut={() => { scale.value = withSpring(1.000, { damping: 18 }); }}
    >
      {/* ── Image ── */}
      <View style={styles.imgWrap}>
        <Image
          source={{ uri: imgUrl }}
          style={styles.img}
          contentFit="cover"
          transition={380}
        />
        {/* Gradient scrim */}
        <LinearGradient
          colors={['transparent', 'rgba(8,6,14,0.72)']}
          style={styles.imgScrim}
        />

        {/* Gold karat badge — top left */}
        <LinearGradient
          colors={[Colors.goldMid, Colors.goldDark]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.karatBadge}
        >
          <Text style={styles.karatText}>{product.karat}</Text>
        </LinearGradient>

        {/* Category pill — bottom right over image */}
        {product.productType && (
          <View style={styles.typePill}>
            <Text style={styles.typePillText}>
              {PRODUCT_TYPE_ICONS[product.productType as ProductType]}{' '}
              {PRODUCT_TYPE_LABELS[product.productType as ProductType]}
            </Text>
          </View>
        )}

        {!product.inStock && (
          <View style={styles.soldOut}>
            <Text style={styles.soldOutText}>نفذت الكمية</Text>
          </View>
        )}
      </View>

      {/* ── Info ── */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.nameAr}</Text>
        <View style={styles.meta}>
          <Text style={styles.weight}>{product.weight} جم</Text>
          <Text style={styles.price}>
            {product.calculatedPrice.toLocaleString('en-US')}
            <Text style={styles.priceSuffix}> EGP</Text>
          </Text>
        </View>
      </View>
    </AnimPressable>
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
    ...Shadow.card,
  },
  imgWrap: { position: 'relative' },
  img: { width: CARD_W, height: CARD_W * 1.12 },
  imgScrim: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: CARD_W * 0.55,
  },
  karatBadge: {
    position: 'absolute', top: Spacing.sm, left: Spacing.sm,
    paddingHorizontal: 9, paddingVertical: 4,
    borderRadius: Radius.full,
  },
  karatText: { color: Colors.white, fontSize: 10, fontWeight: '800', letterSpacing: 0.6 },
  typePill: {
    position: 'absolute', bottom: Spacing.sm, right: Spacing.sm,
    backgroundColor: 'rgba(11,11,18,0.60)',
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1, borderColor: Colors.glassBorder,
  },
  typePillText: { color: Colors.textPrimary, fontSize: 10, fontWeight: '600' },
  soldOut: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.52)',
    justifyContent: 'center', alignItems: 'center',
  },
  soldOutText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.sm },
  info: { padding: Spacing.sm, paddingTop: 10 },
  name: {
    fontSize: FontSize.sm, fontWeight: '600',
    color: Colors.textPrimary, textAlign: 'right',
    marginBottom: 7, lineHeight: 19,
  },
  meta: {
    flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center',
  },
  price: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.goldLight },
  priceSuffix: { fontSize: 10, fontWeight: '500', color: Colors.textMuted },
  weight: { fontSize: 10, color: Colors.textMuted },
});
