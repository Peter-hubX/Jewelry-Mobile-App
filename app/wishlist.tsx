// app/wishlist.tsx
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Pressable, ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring,
} from 'react-native-reanimated';

import { useWishlistContext } from '@/context/WishlistContext';
import { WishlistButton } from '@/components/WishlistButton';
import { Colors, Spacing, Radius, FontSize, Shadow, DEMO_IMAGES } from '@/constants/theme';
import { resolveImageUrl, PRODUCT_TYPE_LABELS } from '@/types';
import { BASE_URL } from '@/services/api';
import type { Product } from '@/types';

const FALLBACK: Record<string, string> = {
  ring: DEMO_IMAGES.ring, necklace: DEMO_IMAGES.necklace,
  bracelet: DEMO_IMAGES.bracelet, earrings: DEMO_IMAGES.earrings, bar: DEMO_IMAGES.bar,
};

export default function WishlistScreen() {
  const insets = useSafeAreaInsets();
  const { wishlist, clear, loaded } = useWishlistContext();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>→</Text>
        </Pressable>
        <Text style={styles.title}>المفضلة</Text>
        {wishlist.length > 0 && (
          <Pressable onPress={clear} style={styles.clearBtn}>
            <Text style={styles.clearText}>مسح الكل</Text>
          </Pressable>
        )}
      </View>

      {!loaded ? (
        <ActivityIndicator color={Colors.gold} style={{ marginTop: 60 }} />
      ) : wishlist.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollView
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        >
          {wishlist.map(product => (
            <WishlistCard key={product.id} product={product} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <View style={empty.wrap}>
      <Text style={empty.icon}>🤍</Text>
      <Text style={empty.title}>لا توجد مفضلة بعد</Text>
      <Text style={empty.sub}>اضغط على القلب على أي منتج لحفظه هنا</Text>
      <Pressable
        style={empty.cta}
        onPress={() => router.push('/(tabs)/catalog')}
      >
        <LinearGradient
          colors={[Colors.goldLight, Colors.gold, Colors.goldDark]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={empty.ctaGrad}
        >
          <Text style={empty.ctaText}>تصفح المنتجات</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}
const empty = StyleSheet.create({
  wrap:    { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 40 },
  icon:    { fontSize: 52, marginBottom: 8 },
  title:   { color: Colors.textPrimary, fontSize: FontSize.lg, fontWeight: '700', textAlign: 'center' },
  sub:     { color: Colors.textMuted, fontSize: FontSize.sm, textAlign: 'center', lineHeight: 22 },
  cta:     { marginTop: 16, borderRadius: Radius.full, overflow: 'hidden', ...Shadow.gold },
  ctaGrad: { paddingVertical: 14, paddingHorizontal: Spacing.xl },
  ctaText: { color: Colors.bg, fontWeight: '900', fontSize: FontSize.md },
});

// ─── Wishlist card ────────────────────────────────────────────────────────────
function WishlistCard({ product }: { product: Product }) {
  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const imgUrl = resolveImageUrl(product.images, BASE_URL)
    ?? FALLBACK[product.productType ?? 'ring']
    ?? DEMO_IMAGES.ring;

  return (
    <Animated.View style={[styles.card, aStyle]}>
      <Pressable
        onPress={() => router.push(`/product/${product.id}`)}
        onPressIn={() => { scale.value = withSpring(0.97); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={styles.cardInner}
      >
        <Image source={{ uri: imgUrl }} style={styles.cardImg} contentFit="cover" transition={400} />

        <LinearGradient
          colors={['transparent', 'rgba(5,4,12,0.92)']}
          locations={[0.35, 1]}
          style={styles.cardGrad}
        />

        {/* Heart button top-right */}
        <View style={styles.heartPos}>
          <WishlistButton product={product} size="sm" withBg />
        </View>

        <View style={styles.cardInfo}>
          <LinearGradient
            colors={[Colors.goldMid, Colors.goldDark]}
            style={styles.badge}
          >
            <Text style={styles.badgeText}>{product.karat}</Text>
          </LinearGradient>
          <Text style={styles.cardName} numberOfLines={1}>{product.nameAr}</Text>
          <Text style={styles.cardPrice}>
            {product.calculatedPrice.toLocaleString('en-US')} EGP
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CARD_W = 172;

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row-reverse', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.glassBorder,
  },
  title:    { flex: 1, color: Colors.textPrimary, fontSize: FontSize.lg, fontWeight: '800', textAlign: 'right' },
  backBtn:  { padding: 4 },
  backArrow:{ color: Colors.goldMid, fontSize: FontSize.lg, fontWeight: '700' },
  clearBtn: { paddingHorizontal: Spacing.sm },
  clearText:{ color: Colors.closed, fontSize: FontSize.sm, fontWeight: '600' },

  grid: {
    flexDirection: 'row-reverse', flexWrap: 'wrap',
    padding: Spacing.md, gap: Spacing.md,
    paddingBottom: 100,
  },

  card:      { width: CARD_W, borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: Colors.glassBorder, ...Shadow.card },
  cardInner: { flex: 1 },
  cardImg:   { width: CARD_W, height: 226 },
  cardGrad:  { position: 'absolute', bottom: 0, left: 0, right: 0, height: 130 },
  heartPos:  { position: 'absolute', top: 10, left: 10 },
  cardInfo:  { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.sm },
  badge:     { alignSelf: 'flex-end', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, marginBottom: 6 },
  badgeText: { color: Colors.white, fontSize: 10, fontWeight: '900' },
  cardName:  { color: Colors.textPrimary, fontSize: FontSize.sm, fontWeight: '700', textAlign: 'right', marginBottom: 4 },
  cardPrice: { color: Colors.goldBright, fontSize: FontSize.md, fontWeight: '900', textAlign: 'right' },
});
