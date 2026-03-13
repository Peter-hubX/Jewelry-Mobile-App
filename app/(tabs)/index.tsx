// app/(tabs)/index.tsx
import React, { useEffect } from 'react';
import {
  ScrollView, View, Text, StyleSheet,
  Pressable, ActivityIndicator, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withDelay, withSpring, Easing,
} from 'react-native-reanimated';

import { useProducts } from '@/hooks/useProducts';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import {
  Colors, Spacing, Radius, FontSize, Shadow, DEMO_IMAGES,
} from '@/constants/theme';
import { AmbientBackground } from '@/components/AmbientBackground';
import { GlassCard } from '@/components/GlassCard';
import {
  resolveImageUrl, PRODUCT_TYPE_LABELS, PRODUCT_TYPE_ICONS,
  type Product, type ProductType,
} from '@/types';
import { BASE_URL } from '@/services/api';

const { width: W } = Dimensions.get('window');

const FALLBACK: Record<string, string> = {
  ring: DEMO_IMAGES.ring, necklace: DEMO_IMAGES.necklace,
  bracelet: DEMO_IMAGES.bracelet, earrings: DEMO_IMAGES.earrings, bar: DEMO_IMAGES.bar,
};

// ─────────────────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { data: products, isLoading } = useProducts();
  const { data: gold } = useGoldPrice();

  // Staggered entrance for each section
  const heroOp = useSharedValue(0);
  const heroY  = useSharedValue(36);
  const sec1Op = useSharedValue(0);
  const sec2Op = useSharedValue(0);

  useEffect(() => {
    heroOp.value = withDelay(80,  withTiming(1, { duration: 680, easing: Easing.out(Easing.cubic) }));
    heroY.value  = withDelay(80,  withSpring(0, { damping: 16, stiffness: 130 }));
    sec1Op.value = withDelay(400, withTiming(1, { duration: 500 }));
    sec2Op.value = withDelay(620, withTiming(1, { duration: 500 }));
  }, []);

  const heroStyle = useAnimatedStyle(() => ({
    opacity: heroOp.value, transform: [{ translateY: heroY.value }],
  }));
  const sec1Style = useAnimatedStyle(() => ({ opacity: sec1Op.value }));
  const sec2Style = useAnimatedStyle(() => ({ opacity: sec2Op.value }));

  const featured = products?.slice(0, 10) ?? [];

  return (
    <View style={styles.root}>
      <AmbientBackground />

      <ScrollView
        style={{ flex: 1, zIndex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ══════════════════════════════════════════════════════
            HERO  — full-width editorial image + headline
        ══════════════════════════════════════════════════════ */}
        <View style={[styles.heroOuter, { paddingTop: insets.top }]}>
          {/* Background photo */}
          <Image
            source={{ uri: DEMO_IMAGES.hero }}
            style={styles.heroBg}
            contentFit="cover"
            transition={600}
          />

          {/* Multi-stop overlay: keeps image visible at top, fades to bg at bottom */}
          <LinearGradient
            colors={[
              'rgba(11,11,18,0.18)',
              'rgba(11,11,18,0.35)',
              'rgba(11,11,18,0.70)',
              Colors.bg,
            ]}
            locations={[0, 0.35, 0.72, 1]}
            style={StyleSheet.absoluteFill}
          />

          {/* Gold shimmer line along top edge */}
          <LinearGradient
            colors={['rgba(200,149,44,0.45)', 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.heroTopLine}
          />

          <Animated.View style={[styles.heroContent, heroStyle]}>
            {/* Eyebrow */}
            <View style={styles.eyebrow}>
              <View style={styles.eyebrowLine} />
              <Text style={styles.eyebrowText}>مجوهرات ميشيل</Text>
              <View style={styles.eyebrowLine} />
            </View>

            {/* Giant headline */}
            <Text style={styles.heroHeadline}>ذهب{'\n'}خالص</Text>

            <Text style={styles.heroSub}>
              أجود المشغولات الذهبية{'\n'}بأسعار السوق لحظة بلحظة
            </Text>

            {/* CTA button */}
            <Pressable
              style={styles.ctaWrap}
              onPress={() => router.push('/(tabs)/catalog')}
            >
              <LinearGradient
                colors={[Colors.goldLight, Colors.gold, Colors.goldDark]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.ctaGrad}
              >
                <Text style={styles.ctaText}>تصفح المجموعة</Text>
                <Text style={styles.ctaArrow}>←</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>

        {/* ══════════════════════════════════════════════════════
            GOLD TICKER
        ══════════════════════════════════════════════════════ */}
        <Animated.View style={[styles.section, sec1Style]}>
          {gold ? (
            <GlassCard variant="gold" style={styles.ticker}>
              {/* Header row */}
              <View style={styles.tickerHead}>
                <View style={styles.tickerStatus}>
                  <View style={[styles.statusDot, {
                    backgroundColor: gold.isMarketOpen ? Colors.open : Colors.closed,
                  }]} />
                  <Text style={[styles.statusText, {
                    color: gold.isMarketOpen ? Colors.open : Colors.closed,
                  }]}>
                    {gold.isMarketOpen ? 'السوق مفتوح' : 'السوق مغلق'}
                  </Text>
                </View>
                <Text style={styles.tickerTitle}>أسعار الذهب اليوم</Text>
              </View>

              {/* Prices */}
              <View style={styles.tickerPrices}>
                <TickerPrice karat="24K" price={gold.karat24} bright />
                <View style={styles.tickerDivider} />
                <TickerPrice karat="21K" price={gold.karat21} />
                <View style={styles.tickerDivider} />
                <TickerPrice karat="18K" price={gold.karat18} />
              </View>

              {/* Link */}
              <Pressable onPress={() => router.push('/(tabs)/gold-prices')}>
                <Text style={styles.tickerLink}>عرض كل الأسعار ←</Text>
              </Pressable>
            </GlassCard>
          ) : (
            <GlassCard variant="gold" style={{ alignItems: 'center', padding: Spacing.lg }}>
              <ActivityIndicator color={Colors.gold} />
            </GlassCard>
          )}
        </Animated.View>

        {/* ══════════════════════════════════════════════════════
            CATEGORY PILLS
        ══════════════════════════════════════════════════════ */}
        <Animated.View style={[styles.section, sec1Style]}>
          <Text style={styles.sectionTitle}>تصفح حسب النوع</Text>
          <ScrollView
            horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsRow}
            style={{ transform: [{ scaleX: -1 }] }}
          >
            {(['ring','necklace','bracelet','earrings','bar'] as ProductType[]).map((t, i) => (
              <View key={t} style={{ transform: [{ scaleX: -1 }] }}>
                <CategoryPill type={t} staggerIndex={i} />
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* ══════════════════════════════════════════════════════
            FEATURED PRODUCTS — horizontal scroll
        ══════════════════════════════════════════════════════ */}
        <Animated.View style={[styles.section, sec2Style]}>
          <View style={styles.sectionHeader}>
            <Pressable onPress={() => router.push('/(tabs)/catalog')}>
              <Text style={styles.sectionLink}>عرض الكل ←</Text>
            </Pressable>
            <Text style={styles.sectionTitle}>أحدث الإضافات</Text>
          </View>

          {isLoading ? (
            <ActivityIndicator color={Colors.gold} style={{ marginVertical: Spacing.xl }} />
          ) : (
            <ScrollView
              horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featRow}
              style={{ transform: [{ scaleX: -1 }] }}
            >
              {featured.map((p, i) => (
                <View key={p.id} style={{ transform: [{ scaleX: -1 }] }}>
                  <FeaturedCard product={p} index={i} />
                </View>
              ))}
            </ScrollView>
          )}
        </Animated.View>

        {/* ══════════════════════════════════════════════════════
            KARAT TILES
        ══════════════════════════════════════════════════════ */}
        <Animated.View style={[styles.section, sec2Style]}>
          <Text style={styles.sectionTitle}>تصفح حسب العيار</Text>
          <View style={styles.karatGrid}>
            {(['24K', '21K', '18K'] as const).map((k, i) => (
              <KaratTile key={k} karat={k} index={i} />
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function TickerPrice({ karat, price, bright }: { karat: string; price: number; bright?: boolean }) {
  return (
    <View style={tp.wrap}>
      <Text style={[tp.price, bright && tp.bright]}>
        {price?.toLocaleString('en-US') ?? '---'}
      </Text>
      <Text style={tp.label}>{karat} / جم</Text>
    </View>
  );
}
const tp = StyleSheet.create({
  wrap:   { alignItems: 'center', flex: 1 },
  price:  { color: Colors.goldMid, fontSize: FontSize.lg, fontWeight: '800' },
  bright: { color: Colors.goldBright, fontSize: FontSize.xl },
  label:  { color: Colors.textMuted, fontSize: 10, marginTop: 3 },
});

// ─────────────────────────────────────────────────────────────────────────────
function CategoryPill({ type, staggerIndex }: { type: ProductType; staggerIndex: number }) {
  const op = useSharedValue(0);
  const x  = useSharedValue(-16);
  useEffect(() => {
    const d = 500 + staggerIndex * 80;
    op.value = withDelay(d, withTiming(1, { duration: 340 }));
    x.value  = withDelay(d, withSpring(0, { damping: 16 }));
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: op.value, transform: [{ translateX: x.value }] }));

  return (
    <Animated.View style={style}>
      <Pressable
        style={cp.pill}
        onPress={() => router.push({ pathname: '/(tabs)/catalog', params: { type } })}
      >
        <Text style={cp.icon}>{PRODUCT_TYPE_ICONS[type]}</Text>
        <Text style={cp.label}>{PRODUCT_TYPE_LABELS[type]}</Text>
      </Pressable>
    </Animated.View>
  );
}
const cp = StyleSheet.create({
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    paddingHorizontal: Spacing.md, paddingVertical: 10,
    backgroundColor: Colors.glass, borderRadius: Radius.full,
    borderWidth: 1, borderColor: Colors.glassBorder,
  },
  icon:  { fontSize: 17 },
  label: { fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: '600' },
});

// ─────────────────────────────────────────────────────────────────────────────
function FeaturedCard({ product, index }: { product: Product; index: number }) {
  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const imgUrl = resolveImageUrl(product.images, BASE_URL)
    ?? FALLBACK[product.productType ?? 'ring']
    ?? DEMO_IMAGES.ring;

  return (
    <Animated.View style={[fc.card, aStyle]}>
      <Pressable
        onPress={() => router.push(`/product/${product.id}`)}
        onPressIn={() => { scale.value = withSpring(0.955); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={{ flex: 1 }}
      >
        <Image source={{ uri: imgUrl }} style={fc.img} contentFit="cover" transition={400} />
        <LinearGradient
          colors={['transparent', 'rgba(8,6,14,0.88)']}
          locations={[0.38, 1]}
          style={fc.grad}
        />
        <View style={fc.info}>
          <LinearGradient
            colors={[Colors.goldMid, Colors.goldDark]}
            style={fc.badge}
          >
            <Text style={fc.badgeText}>{product.karat}</Text>
          </LinearGradient>
          <Text style={fc.name} numberOfLines={1}>{product.nameAr}</Text>
          <Text style={fc.price}>{product.calculatedPrice.toLocaleString('en-US')} EGP</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}
const fc = StyleSheet.create({
  card: {
    width: 172, borderRadius: Radius.xl, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.glassBorder, ...Shadow.card,
  },
  img:   { width: 172, height: 226 },
  grad:  { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 },
  info:  { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.sm },
  badge: {
    alignSelf: 'flex-end', paddingHorizontal: 9, paddingVertical: 3,
    borderRadius: Radius.full, marginBottom: 5,
  },
  badgeText: { color: Colors.white, fontSize: 10, fontWeight: '800' },
  name:  {
    color: Colors.textPrimary, fontSize: FontSize.sm, fontWeight: '700',
    textAlign: 'right', marginBottom: 3,
  },
  price: { color: Colors.goldBright, fontSize: FontSize.sm, fontWeight: '800', textAlign: 'right' },
});

// ─────────────────────────────────────────────────────────────────────────────
const KARAT_CFG = {
  '24K': { colors: [Colors.goldLight, Colors.gold] as [string, string], sub: 'ذهب خالص' },
  '21K': { colors: [Colors.gold, Colors.goldDark] as [string, string],  sub: 'الأكثر شيوعاً' },
  '18K': { colors: [Colors.goldDark, '#3A2008'] as [string, string],    sub: 'عصري وأنيق' },
};

function KaratTile({ karat, index }: { karat: '24K'|'21K'|'18K'; index: number }) {
  const scale = useSharedValue(1);
  const s = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const { colors, sub } = KARAT_CFG[karat];

  return (
    <Animated.View style={[kt.tile, s]}>
      <Pressable
        onPress={() => router.push({ pathname: '/(tabs)/catalog', params: { karat } })}
        onPressIn={() => { scale.value = withSpring(0.94); }}
        onPressOut={() => { scale.value = withSpring(1.00); }}
        style={{ flex: 1 }}
      >
        <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={kt.grad}>
          <Text style={kt.karat}>{karat}</Text>
          <Text style={kt.sub}>{sub}</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}
const kt = StyleSheet.create({
  tile: { flex: 1, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.gold },
  grad: { paddingVertical: Spacing.lg + 4, alignItems: 'center' },
  karat: { color: Colors.white, fontSize: FontSize.xl, fontWeight: '900' },
  sub:   { color: 'rgba(255,255,255,0.68)', fontSize: 10, marginTop: 4, textAlign: 'center' },
});

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },

  // Hero
  heroOuter:   { position: 'relative', minHeight: 480, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  heroBg:      { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  heroTopLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
  heroContent: { alignItems: 'flex-end', paddingTop: 80 },

  eyebrow: {
    flexDirection: 'row-reverse', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md,
  },
  eyebrowLine: { flex: 1, height: 1, backgroundColor: Colors.goldBorder },
  eyebrowText: { color: Colors.goldMid, fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 3 },

  heroHeadline: {
    color: Colors.white, fontSize: FontSize.hero, fontWeight: '900',
    textAlign: 'right', lineHeight: 58, marginBottom: Spacing.md,
    textShadowColor: 'rgba(0,0,0,0.55)',
    textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 12,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.65)', fontSize: FontSize.sm,
    textAlign: 'right', lineHeight: 23, marginBottom: Spacing.xl,
  },
  ctaWrap: { borderRadius: Radius.full, overflow: 'hidden', ...Shadow.gold },
  ctaGrad: {
    paddingVertical: 14, paddingHorizontal: Spacing.xl,
    flexDirection: 'row-reverse', alignItems: 'center', gap: 8,
  },
  ctaText:  { color: Colors.bg, fontWeight: '900', fontSize: FontSize.md, letterSpacing: 0.4 },
  ctaArrow: { color: Colors.bg, fontWeight: '900', fontSize: FontSize.lg },

  // Sections
  section: { paddingHorizontal: Spacing.lg, marginTop: Spacing.xl },
  sectionHeader: {
    flexDirection: 'row-reverse', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary,
    textAlign: 'right', marginBottom: Spacing.md,
  },
  sectionLink: { fontSize: FontSize.sm, color: Colors.goldMid, fontWeight: '600' },

  // Ticker
  ticker:       { gap: Spacing.md },
  tickerHead: {
    flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center',
  },
  tickerTitle:  { fontSize: FontSize.md, fontWeight: '800', color: Colors.textPrimary },
  tickerStatus: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5 },
  statusDot:    { width: 7, height: 7, borderRadius: 4 },
  statusText:   { fontSize: 11, fontWeight: '700' },
  tickerPrices: { flexDirection: 'row-reverse', alignItems: 'center' },
  tickerDivider:{ width: 1, height: 32, backgroundColor: Colors.goldBorder },
  tickerLink:   { color: Colors.goldMid, fontSize: FontSize.sm, fontWeight: '600', textAlign: 'left' },

  // Pills
  pillsRow: { gap: Spacing.sm, paddingVertical: 4 },

  // Featured
  featRow: { gap: Spacing.md, paddingBottom: 4 },

  // Karat grid
  karatGrid: { flexDirection: 'row-reverse', gap: Spacing.sm },
});
