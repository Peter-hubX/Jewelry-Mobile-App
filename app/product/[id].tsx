// app/product/[id].tsx
import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  ActivityIndicator, Pressable, Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle, withDelay,
  withTiming, withSpring, Easing,
} from 'react-native-reanimated';

import { useGoldPrice } from '@/hooks/useGoldPrice';
import { api, BASE_URL } from '@/services/api';
import { Colors, Spacing, Radius, FontSize, Shadow, KaratPremiums, DEMO_IMAGES } from '@/constants/theme';
import {
  resolveImageUrl, PRODUCT_TYPE_LABELS, PRODUCT_TYPE_ICONS,
  type Product, type ProductType,
} from '@/types';
import { AmbientBackground } from '@/components/AmbientBackground';
import { GlassCard } from '@/components/GlassCard';

const { width: W } = Dimensions.get('window');
const IMG_H = W * 0.94;

const FALLBACK: Record<string, string> = {
  ring:     DEMO_IMAGES.ring2,
  necklace: DEMO_IMAGES.necklace2,
  bracelet: DEMO_IMAGES.bracelet2,
  earrings: DEMO_IMAGES.earrings2,
  bar:      DEMO_IMAGES.bar,
};

export default function ProductDetailScreen() {
  const { id }    = useLocalSearchParams<{ id: string }>();
  const insets    = useSafeAreaInsets();
  const productId = Number(id);

  const { data: product, isLoading, isError } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn:  () => api.products.detail(productId),
    enabled:  !Number.isNaN(productId),
  });
  const { data: goldPrice } = useGoldPrice();

  // Slide-up panel
  const panelY  = useSharedValue(70);
  const panelOp = useSharedValue(0);
  useEffect(() => {
    if (product) {
      panelY.value  = withDelay(180, withSpring(0, { damping: 16, stiffness: 130 }));
      panelOp.value = withDelay(180, withTiming(1, { duration: 380, easing: Easing.out(Easing.quad) }));
    }
  }, [product]);
  const panelStyle = useAnimatedStyle(() => ({
    opacity: panelOp.value, transform: [{ translateY: panelY.value }],
  }));

  const imgUrl = resolveImageUrl(product?.images, BASE_URL)
    ?? FALLBACK[product?.productType ?? 'ring']
    ?? DEMO_IMAGES.ring2;

  const karatPct = product ? ((KaratPremiums[product.karat] - 1) * 100).toFixed(0) : '0';
  const basePrice = goldPrice && product
    ? product.karat === '24K' ? goldPrice.karat24
    : product.karat === '21K' ? goldPrice.karat21
    : goldPrice.karat18
    : null;

  return (
    <View style={styles.root}>
      <AmbientBackground />

      {/* Back button — always on top of image */}
      <Pressable
        style={[styles.backBtn, { top: insets.top + Spacing.sm }]}
        onPress={() => router.back()}
        hitSlop={14}
      >
        <Text style={styles.backArrow}>←</Text>
      </Pressable>

      {/* Loading */}
      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.gold} />
        </View>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <View style={styles.center}>
          <Text style={styles.errEmoji}>⚠️</Text>
          <Text style={styles.errText}>تعذر تحميل المنتج</Text>
          <Pressable style={styles.actionBtn} onPress={() => router.back()}>
            <Text style={styles.actionBtnText}>العودة</Text>
          </Pressable>
        </View>
      )}

      {product && !isLoading && !isError && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xxl }}
        >
          {/* ── Hero image ── */}
          <View style={styles.imgWrap}>
            <Image
              source={{ uri: imgUrl }}
              style={styles.img}
              contentFit="cover"
              transition={500}
            />
            {/* Cinematic gradient: visible at top, fades to bg */}
            <LinearGradient
              colors={['transparent', 'rgba(11,11,18,0.38)', Colors.bg]}
              locations={[0.45, 0.75, 1]}
              style={styles.imgGrad}
            />
            {/* Gold top edge */}
            <LinearGradient
              colors={[Colors.goldBorder, 'transparent']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.imgTopLine}
            />

            {/* Karat badge */}
            <LinearGradient
              colors={[Colors.goldMid, Colors.goldDark]}
              style={styles.karatBadge}
            >
              <Text style={styles.karatBadgeText}>{product.karat}</Text>
            </LinearGradient>

            {/* Type pill */}
            {product.productType && (
              <View style={styles.typePill}>
                <Text style={styles.typePillText}>
                  {PRODUCT_TYPE_ICONS[product.productType as ProductType]}{' '}
                  {PRODUCT_TYPE_LABELS[product.productType as ProductType]}
                </Text>
              </View>
            )}

            {!product.inStock && (
              <View style={styles.soldOutBadge}>
                <Text style={styles.soldOutText}>نفذت الكمية</Text>
              </View>
            )}
          </View>

          {/* ── Sliding info panel ── */}
          <Animated.View style={[styles.panel, panelStyle]}>

            {/* Name block */}
            <View style={styles.nameBlock}>
              <Text style={styles.name}>{product.nameAr}</Text>
              {product.name && product.name !== product.nameAr && (
                <Text style={styles.nameEn}>{product.name}</Text>
              )}
              <Text style={styles.categoryLabel}>
                {product.category || PRODUCT_TYPE_LABELS[product.productType as ProductType]}
              </Text>
            </View>

            {/* Price highlight */}
            <GlassCard variant="gold" style={styles.priceCard}>
              <Text style={styles.priceLabel}>السعر الإجمالي</Text>
              <Text style={styles.price}>
                {product.calculatedPrice.toLocaleString('en-US')}
                <Text style={styles.priceCurrency}> EGP</Text>
              </Text>
            </GlassCard>

            {/* Specs 2×2 grid */}
            <Text style={styles.sectionTitle}>المواصفات</Text>
            <View style={styles.specsGrid}>
              <SpecCard icon="⚖️" label="الوزن"     value={`${product.weight} جم`} />
              <SpecCard icon="✨" label="العيار"    value={product.karat} />
              <SpecCard icon="🔨" label="المصنعية" value={`${karatPct}%`} />
              <SpecCard icon="🏷️" label="الفئة"    value={product.category || '—'} />
            </View>

            {/* Price breakdown */}
            {basePrice && (
              <>
                <Text style={styles.sectionTitle}>تفاصيل التسعير</Text>
                <GlassCard noPadding style={styles.breakdown}>
                  <BDRow label="سعر الذهب / جم" value={`${basePrice.toLocaleString('en-US')} EGP`} />
                  <View style={styles.bdLine} />
                  <BDRow label="الوزن"          value={`${product.weight} جم`} />
                  <View style={styles.bdLine} />
                  <BDRow label="المصنعية"       value={`${karatPct}%`} />
                  <View style={[styles.bdLine, { backgroundColor: Colors.goldBorder }]} />
                  <BDRow
                    label="الإجمالي"
                    value={`${product.calculatedPrice.toLocaleString('en-US')} EGP`}
                    bold
                  />
                </GlassCard>
              </>
            )}

            <Text style={styles.note}>
              * السعر محسوب بناءً على سعر السوق الحالي ويتغير تلقائياً مع تغير أسعار الذهب
            </Text>
          </Animated.View>
        </ScrollView>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function SpecCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <GlassCard style={spec.card} noPadding>
      <View style={spec.inner}>
        <Text style={spec.icon}>{icon}</Text>
        <Text style={spec.value}>{value}</Text>
        <Text style={spec.label}>{label}</Text>
      </View>
    </GlassCard>
  );
}
const spec = StyleSheet.create({
  card:  { width: (W - Spacing.lg * 2 - Spacing.sm * 3) / 2, padding: 0 },
  inner: { padding: Spacing.md, alignItems: 'flex-end' },
  icon:  { fontSize: 22, marginBottom: 7 },
  value: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary, marginBottom: 3 },
  label: { fontSize: FontSize.xs, color: Colors.textMuted },
});

function BDRow({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={bd.row}>
      <Text style={[bd.value, bold && bd.bold]}>{value}</Text>
      <Text style={[bd.label, bold && bd.bold]}>{label}</Text>
    </View>
  );
}
const bd = StyleSheet.create({
  row:   { flexDirection: 'row-reverse', justifyContent: 'space-between', paddingVertical: 13, paddingHorizontal: Spacing.md },
  label: { fontSize: FontSize.sm, color: Colors.textSecond },
  value: { fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: '600' },
  bold:  { fontWeight: '900', fontSize: FontSize.md, color: Colors.goldBright },
});

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },

  backBtn: {
    position: 'absolute', right: Spacing.lg, zIndex: 20,
    width: 42, height: 42, borderRadius: Radius.full,
    backgroundColor: 'rgba(0,0,0,0.52)', borderWidth: 1, borderColor: Colors.glassBorder,
    justifyContent: 'center', alignItems: 'center',
  },
  backArrow: { color: Colors.white, fontSize: 20, fontWeight: '700', lineHeight: 22 },

  imgWrap:    { position: 'relative' },
  img:        { width: W, height: IMG_H },
  imgGrad:    { position: 'absolute', bottom: 0, left: 0, right: 0, height: IMG_H * 0.62 },
  imgTopLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 1.5 },

  karatBadge: {
    position: 'absolute', bottom: Spacing.xl, left: Spacing.lg,
    paddingHorizontal: Spacing.md, paddingVertical: 7, borderRadius: Radius.full,
  },
  karatBadgeText: { color: Colors.white, fontSize: FontSize.md, fontWeight: '900' },
  typePill: {
    position: 'absolute', bottom: Spacing.xl, right: Spacing.lg,
    backgroundColor: 'rgba(11,11,18,0.62)',
    paddingHorizontal: Spacing.md, paddingVertical: 7,
    borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.glassBorder,
  },
  typePillText: { color: Colors.textPrimary, fontSize: FontSize.sm, fontWeight: '600' },
  soldOutBadge: {
    position: 'absolute', top: Spacing.xl * 2.5, right: Spacing.lg,
    backgroundColor: Colors.closed, paddingHorizontal: Spacing.md, paddingVertical: 6,
    borderRadius: Radius.full,
  },
  soldOutText: { color: Colors.white, fontSize: FontSize.xs, fontWeight: '700' },

  panel: {
    marginTop: -Spacing.xl,
    backgroundColor: Colors.bg,
    borderTopLeftRadius: Radius.xxl, borderTopRightRadius: Radius.xxl,
    padding: Spacing.lg, paddingTop: Spacing.xl,
  },

  nameBlock: { alignItems: 'flex-end', marginBottom: Spacing.lg },
  name: {
    fontSize: FontSize.xxl, fontWeight: '900', color: Colors.textPrimary,
    textAlign: 'right', lineHeight: 37,
  },
  nameEn: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'right', marginTop: 4 },
  categoryLabel: { fontSize: FontSize.sm, color: Colors.goldMid, fontWeight: '600', marginTop: 6 },

  priceCard: { marginBottom: Spacing.lg, alignItems: 'flex-end' },
  priceLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: 5 },
  price: { fontSize: 36, fontWeight: '900', color: Colors.goldBright },
  priceCurrency: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.goldLight },

  sectionTitle: {
    fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary,
    textAlign: 'right', marginBottom: Spacing.md,
  },
  specsGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },

  breakdown: { marginBottom: Spacing.lg },
  bdLine:    { height: 1, backgroundColor: Colors.divider, marginHorizontal: Spacing.md },

  note: { fontSize: 11, color: Colors.textMuted, textAlign: 'right', lineHeight: 18 },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: Spacing.xxl },
  errEmoji: { fontSize: 40, marginBottom: Spacing.md },
  errText: { fontSize: FontSize.md, color: Colors.textSecond, marginBottom: Spacing.md },
  actionBtn: {
    backgroundColor: Colors.gold, paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm, borderRadius: Radius.full,
  },
  actionBtnText: { color: Colors.white, fontWeight: '800', fontSize: FontSize.sm },
});
