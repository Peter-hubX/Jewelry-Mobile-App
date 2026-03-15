// app/product/[id].tsx
import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  ActivityIndicator, Pressable, Dimensions, Linking, Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle, withDelay,
  withTiming, withSpring, withSequence, Easing,
} from 'react-native-reanimated';

import { useGoldPrice } from '@/hooks/useGoldPrice';
import { useWishlistContext } from '@/context/WishlistContext';
import { hapticLight, hapticMedium, hapticSuccess } from '@/utils/haptics';
import { api, BASE_URL } from '@/services/api';
import { Colors, Spacing, Radius, FontSize, Shadow, KaratPremiums, DEMO_IMAGES } from '@/constants/theme';
import {
  resolveImageUrl, PRODUCT_TYPE_LABELS, PRODUCT_TYPE_ICONS,
  type Product, type ProductType,
} from '@/types';
import { resolveLocalImage } from '@/constants/localImages';
import { buildWhatsAppUrl, buildProductInquiryMessage } from '@/constants/contact';
import { AmbientBackground } from '@/components/AmbientBackground';
import { GlassCard } from '@/components/GlassCard';

const { width: W } = Dimensions.get('window');
const IMG_H = W * 0.94;

const DEMO_FALLBACK: Record<string, string> = {
  ring: DEMO_IMAGES.ring2, necklace: DEMO_IMAGES.necklace2,
  bracelet: DEMO_IMAGES.bracelet2, earrings: DEMO_IMAGES.earrings2, bar: DEMO_IMAGES.bar,
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const productId = id as string;

  const { data: product, isLoading, isError } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: () => api.products.detail(productId),
    enabled: !!productId,
  });
  const { data: goldPrice } = useGoldPrice();
  const { isWishlisted, toggle } = useWishlistContext();
  const active = product ? isWishlisted(product.id) : false;

  // Entrance animations
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

  // WhatsApp button animation
  const waScale = useSharedValue(1);
  const waStyle = useAnimatedStyle(() => ({ transform: [{ scale: waScale.value }] }));

  // Star button animation
  const starScale = useSharedValue(1);
  const starStyle = useAnimatedStyle(() => ({ transform: [{ scale: starScale.value }] }));

  function handleStar() {
    if (!product) return;
    hapticSuccess();
    starScale.value = withSequence(
      withSpring(1.5, { damping: 5, stiffness: 300 }),
      withSpring(1.0, { damping: 10 }),
    );
    toggle(product);
  }

  // Image resolution
  const localSrc = product ? resolveLocalImage(product.id, product.productType) : null;
  const apiUrl   = product ? resolveImageUrl(product.images, BASE_URL) : null;
  const demoUrl  = DEMO_FALLBACK[product?.productType ?? 'ring'] ?? DEMO_IMAGES.ring2;
  const imageSource = localSrc ?? (apiUrl ? { uri: apiUrl } : null) ?? { uri: demoUrl };

  // Pricing helpers
  const karatPct = product ? ((KaratPremiums[product.karat] - 1) * 100).toFixed(0) : '0';
  const basePrice = goldPrice && product
    ? product.karat === '24K' ? goldPrice.karat24
      : product.karat === '21K' ? goldPrice.karat21
        : goldPrice.karat18
    : null;

  async function handleWhatsApp() {
    if (!product) return;
    hapticMedium();
    const msg = buildProductInquiryMessage({
      nameAr: product.nameAr, karat: product.karat,
      weight: product.weight, price: product.calculatedPrice,
    });
    const url = buildWhatsAppUrl(msg);
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert('واتساب غير متاح', 'يرجى التواصل معنا مباشرةً عبر الهاتف.',
        [{ text: 'حسناً', style: 'default' }]);
    }
  }

  return (
    <View style={styles.root}>
      <AmbientBackground />

      {/* Back button */}
      <Pressable
        style={[styles.backBtn, { top: insets.top || Spacing.lg, right: Spacing.lg }]}
        onPress={() => { hapticLight(); router.back(); }}
        hitSlop={14}
      >
        <Text style={styles.backArrow}>←</Text>
      </Pressable>

      {/* ⭐ Star / wishlist button — top left of image */}
      {product && (
        <Animated.View style={[
          styles.starWrap,
          { top: insets.top || Spacing.lg, left: Spacing.lg },
          starStyle,
        ]}>
          <Pressable onPress={handleStar} hitSlop={14} style={styles.starBtn}>
            <Text style={[styles.starIcon, active && styles.starIconOn]}>
              {active ? '⭐' : '☆'}
            </Text>
          </Pressable>
        </Animated.View>
      )}

      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.gold} />
        </View>
      )}

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
          contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        >
          {/* Hero image */}
          <View style={styles.imgWrap}>
            <Image source={imageSource} style={styles.img} contentFit="cover" transition={500} />
            <LinearGradient
              colors={['transparent', 'rgba(11,11,18,0.38)', Colors.bg]}
              locations={[0.45, 0.75, 1]}
              style={styles.imgGrad}
            />
            <LinearGradient
              colors={[Colors.goldBorder, 'transparent']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.imgTopLine}
            />
            <LinearGradient colors={[Colors.goldMid, Colors.goldDark]} style={styles.karatBadge}>
              <Text style={styles.karatBadgeText}>{product.karat}</Text>
            </LinearGradient>
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

          {/* Sliding info panel */}
          <Animated.View style={[styles.panel, panelStyle]}>

            <View style={styles.nameBlock}>
              <Text style={styles.name}>{product.nameAr}</Text>
              {product.name && product.name !== product.nameAr && (
                <Text style={styles.nameEn}>{product.name}</Text>
              )}
              <Text style={styles.categoryLabel}>
                {product.category || PRODUCT_TYPE_LABELS[product.productType as ProductType]}
              </Text>
            </View>

            {/* Price */}
            <GlassCard variant="gold" style={styles.priceCard}>
              <Text style={styles.priceLabel}>السعر التقريبي</Text>
              <Text style={styles.price}>
                {product.calculatedPrice.toLocaleString('en-US')}
                <Text style={styles.priceCurrency}> EGP</Text>
              </Text>
              <Text style={styles.priceNote}>السعر يتغير مع سعر الذهب لحظة بلحظة</Text>
            </GlassCard>

            {/* Action buttons row — WhatsApp + Add to favorites */}
            <View style={styles.actionsRow}>
              {/* WhatsApp */}
              <Animated.View style={[styles.waWrap, waStyle]}>
                <Pressable
                  style={[styles.waBtn, !product.inStock && styles.waBtnDisabled]}
                  onPress={product.inStock ? handleWhatsApp : undefined}
                  onPressIn={() => { if (product.inStock) waScale.value = withSpring(0.96); }}
                  onPressOut={() => { waScale.value = withSpring(1); }}
                  disabled={!product.inStock}
                >
                  <LinearGradient
                    colors={product.inStock ? ['#25D366', '#1DA851'] : ['#3A3A3A', '#2A2A2A']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={styles.waGrad}
                  >
                    <Text style={styles.waIcon}>💬</Text>
                    <Text style={styles.waText}>
                      {product.inStock ? 'استفسر عبر واتساب' : 'نفذت الكمية'}
                    </Text>
                  </LinearGradient>
                </Pressable>
              </Animated.View>

              {/* Add to favorites */}
              <Animated.View style={starStyle}>
                <Pressable onPress={handleStar} style={[
                  styles.favBtn,
                  active && styles.favBtnOn,
                ]}>
                  <Text style={styles.favStar}>{active ? '⭐' : '☆'}</Text>
                  <Text style={[styles.favText, active && styles.favTextOn]}>
                    {active ? 'في المفضلة' : 'أضف للمفضلة'}
                  </Text>
                </Pressable>
              </Animated.View>
            </View>

            {/* Specs grid */}
            <Text style={styles.sectionTitle}>المواصفات</Text>
            <View style={styles.specsGrid}>
              <SpecCard icon="⚖️" label="الوزن"     value={`${product.weight} جم`} />
              <SpecCard icon="✨" label="العيار"     value={product.karat} />
              <SpecCard icon="🔨" label="المصنعية"   value={`${karatPct}%`} />
              <SpecCard icon="🏷️" label="الفئة"      value={product.category || '—'} />
            </View>

            {/* Price breakdown */}
            {basePrice && (
              <>
                <Text style={styles.sectionTitle}>تفاصيل التسعير</Text>
                <GlassCard noPadding style={styles.breakdown}>
                  <BDRow label="سعر الذهب / جم" value={`${basePrice.toLocaleString('en-US')} EGP`} />
                  <View style={styles.bdLine} />
                  <BDRow label="الوزن"           value={`${product.weight} جم`} />
                  <View style={styles.bdLine} />
                  <BDRow label="المصنعية"         value={`${karatPct}%`} />
                  <View style={[styles.bdLine, { backgroundColor: Colors.goldBorder }]} />
                  <BDRow label="الإجمالي التقريبي"
                    value={`${product.calculatedPrice.toLocaleString('en-US')} EGP`} bold />
                </GlassCard>
              </>
            )}

            <Text style={styles.note}>
              * السعر محسوب بناءً على سعر السوق الحالي ويتغير تلقائياً. السعر النهائي يُحدَّد عند الاستلام.
            </Text>
          </Animated.View>
        </ScrollView>
      )}
    </View>
  );
}

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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },

  backBtn: {
    position: 'absolute', zIndex: 20,
    width: 42, height: 42, borderRadius: Radius.full,
    backgroundColor: 'rgba(0,0,0,0.52)', borderWidth: 1, borderColor: Colors.glassBorder,
    justifyContent: 'center', alignItems: 'center',
  },
  backArrow: { color: Colors.white, fontSize: 20, fontWeight: '700', lineHeight: 22 },

  starWrap: { position: 'absolute', zIndex: 20 },
  starBtn:  {
    width: 42, height: 42, borderRadius: Radius.full,
    backgroundColor: 'rgba(0,0,0,0.60)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.30)',
    justifyContent: 'center', alignItems: 'center',
  },
  starIcon:   { fontSize: 20, color: 'rgba(255,255,255,0.95)' },
  starIconOn: { color: Colors.goldBright },

  imgWrap:    { position: 'relative' },
  img:        { width: W, height: IMG_H },
  imgGrad:    { position: 'absolute', bottom: 0, left: 0, right: 0, height: IMG_H * 0.62 },
  imgTopLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 1.5 },

  karatBadge:     { position: 'absolute', bottom: Spacing.xl, left: Spacing.lg, paddingHorizontal: Spacing.md, paddingVertical: 7, borderRadius: Radius.full },
  karatBadgeText: { color: Colors.white, fontSize: FontSize.md, fontWeight: '900' },
  typePill:       { position: 'absolute', bottom: Spacing.xl, right: Spacing.lg, backgroundColor: 'rgba(11,11,18,0.62)', paddingHorizontal: Spacing.md, paddingVertical: 7, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.glassBorder },
  typePillText:   { color: Colors.textPrimary, fontSize: FontSize.sm, fontWeight: '600' },
  soldOutBadge:   { position: 'absolute', top: Spacing.xl * 2.5, right: Spacing.lg, backgroundColor: Colors.closed, paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: Radius.full },
  soldOutText:    { color: Colors.white, fontSize: FontSize.xs, fontWeight: '700' },

  panel: {
    marginTop: -Spacing.xl,
    backgroundColor: Colors.bg,
    borderTopLeftRadius: Radius.xxl, borderTopRightRadius: Radius.xxl,
    padding: Spacing.lg, paddingTop: Spacing.xl,
  },

  nameBlock:     { alignItems: 'flex-end', marginBottom: Spacing.lg },
  name:          { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.textPrimary, textAlign: 'right', lineHeight: 37 },
  nameEn:        { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'right', marginTop: 4 },
  categoryLabel: { fontSize: FontSize.sm, color: Colors.goldMid, fontWeight: '600', marginTop: 6 },

  priceCard:    { marginBottom: Spacing.md, alignItems: 'flex-end' },
  priceLabel:   { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: 5 },
  price:        { fontSize: 36, fontWeight: '900', color: Colors.goldBright },
  priceCurrency:{ fontSize: FontSize.lg, fontWeight: '600', color: Colors.goldLight },
  priceNote:    { fontSize: 10, color: Colors.textMuted, marginTop: 6, textAlign: 'right' },

  // Actions row
  actionsRow: { flexDirection: 'row-reverse', gap: Spacing.sm, marginBottom: Spacing.lg },
  waWrap:     { flex: 1 },
  waBtn:      { borderRadius: Radius.full, overflow: 'hidden', shadowColor: '#25D366', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 10 },
  waBtnDisabled: { shadowColor: 'transparent', elevation: 0 },
  waGrad:     { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, paddingHorizontal: Spacing.md },
  waIcon:     { fontSize: 18 },
  waText:     { color: Colors.white, fontWeight: '900', fontSize: FontSize.sm, letterSpacing: 0.3 },

  favBtn: {
    flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, paddingHorizontal: Spacing.md,
    borderRadius: Radius.full, borderWidth: 1.5,
    borderColor: Colors.glassBorder, backgroundColor: Colors.glass,
    gap: 2, minWidth: 80,
  },
  favBtnOn:   { backgroundColor: Colors.glassGold, borderColor: Colors.goldBorder },
  favStar:    { fontSize: 18 },
  favText:    { fontSize: 10, color: Colors.textMuted, fontWeight: '700' },
  favTextOn:  { color: Colors.goldLight },

  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary, textAlign: 'right', marginBottom: Spacing.md },
  specsGrid:    { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  breakdown:    { marginBottom: Spacing.lg },
  bdLine:       { height: 1, backgroundColor: Colors.divider, marginHorizontal: Spacing.md },
  note:         { fontSize: 11, color: Colors.textMuted, textAlign: 'right', lineHeight: 18 },

  center:         { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: Spacing.xxl },
  errEmoji:       { fontSize: 40, marginBottom: Spacing.md },
  errText:        { fontSize: FontSize.md, color: Colors.textSecond, marginBottom: Spacing.md },
  actionBtn:      { backgroundColor: Colors.gold, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.full },
  actionBtnText:  { color: Colors.white, fontWeight: '800', fontSize: FontSize.sm },
});
