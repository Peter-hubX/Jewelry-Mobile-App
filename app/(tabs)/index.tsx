// app/(tabs)/index.tsx  — Enhanced Homepage
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ScrollView, View, Text, StyleSheet,
  Pressable, ActivityIndicator, Dimensions, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withDelay, withSpring, withRepeat,
  withSequence, Easing, interpolate,
} from 'react-native-reanimated';

import { useProducts } from '@/hooks/useProducts';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import {
  Colors, Spacing, Radius, FontSize, Shadow, DEMO_IMAGES,
} from '@/constants/theme';
import { AmbientBackground } from '@/components/AmbientBackground';
import { SkeletonCard } from '@/components/SkeletonCard';
import { GlassCard } from '@/components/GlassCard';
import {
  resolveImageUrl, PRODUCT_TYPE_LABELS, PRODUCT_TYPE_ICONS,
  type Product, type ProductType,
} from '@/types';
import { BASE_URL } from '@/services/api';
import { hapticLight } from '@/utils/haptics';

const { width: W } = Dimensions.get('window');

const FALLBACK: Record<string, string> = {
  ring: DEMO_IMAGES.ring, necklace: DEMO_IMAGES.necklace,
  bracelet: DEMO_IMAGES.bracelet, earrings: DEMO_IMAGES.earrings, bar: DEMO_IMAGES.bar,
};

// ─────────────────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { data: products, isLoading, refetch: refetchProducts } = useProducts();
  const { data: gold, refetch: refetchGold } = useGoldPrice();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    hapticLight();
    setIsRefreshing(true);
    await Promise.all([refetchProducts(), refetchGold()]);
    setIsRefreshing(false);
  }, [refetchProducts, refetchGold]);

  // Entrance animations
  const heroOp = useSharedValue(0);
  const heroY = useSharedValue(44);
  const sec1Op = useSharedValue(0);
  const sec2Op = useSharedValue(0);
  const sec3Op = useSharedValue(0);
  const sec4Op = useSharedValue(0);

  // Pulsing dot for live status
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    heroOp.value = withDelay(80, withTiming(1, { duration: 760, easing: Easing.out(Easing.cubic) }));
    heroY.value = withDelay(80, withSpring(0, { damping: 14, stiffness: 110 }));
    sec1Op.value = withDelay(440, withTiming(1, { duration: 520 }));
    sec2Op.value = withDelay(620, withTiming(1, { duration: 520 }));
    sec3Op.value = withDelay(800, withTiming(1, { duration: 520 }));
    sec4Op.value = withDelay(980, withTiming(1, { duration: 520 }));

    // Pulse animation for live dot
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.6, { duration: 800, easing: Easing.out(Easing.quad) }),
        withTiming(1.0, { duration: 800, easing: Easing.in(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, []);

  const heroStyle = useAnimatedStyle(() => ({
    opacity: heroOp.value, transform: [{ translateY: heroY.value }],
  }));
  const sec1Style = useAnimatedStyle(() => ({ opacity: sec1Op.value }));
  const sec2Style = useAnimatedStyle(() => ({ opacity: sec2Op.value }));
  const sec3Style = useAnimatedStyle(() => ({ opacity: sec3Op.value }));
  const sec4Style = useAnimatedStyle(() => ({ opacity: sec4Op.value }));
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: interpolate(pulseScale.value, [1, 1.6], [0.8, 0]),
  }));

  const featured = products?.slice(0, 10) ?? [];

  return (
    <View style={styles.root}>
      <AmbientBackground />

      <ScrollView
        style={{ flex: 1, zIndex: 1 }}
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.gold}
            colors={[Colors.gold]}
          />
        }
      >
        {/* ══════════════════════════════════════════════════════
            HERO  — full-bleed editorial image + centered content
        ══════════════════════════════════════════════════════ */}
        <View style={[styles.heroOuter, { paddingTop: insets.top }]}>
          <Image
            source={{ uri: DEMO_IMAGES.hero }}
            style={styles.heroBg}
            contentFit="cover"
            transition={600}
          />

          <LinearGradient
            colors={[
              'rgba(11,11,18,0.10)',
              'rgba(11,11,18,0.20)',
              'rgba(11,11,18,0.60)',
              'rgba(11,11,18,0.88)',
              Colors.bg,
            ]}
            locations={[0, 0.25, 0.55, 0.80, 1]}
            style={StyleSheet.absoluteFill}
          />

          <LinearGradient
            colors={['transparent', 'rgba(200,149,44,0.55)', 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.heroTopLine}
          />
          <LinearGradient
            colors={['transparent', 'rgba(200,149,44,0.20)', 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.heroBottomLine}
          />

          <View style={[styles.cornerAccent, styles.cornerTR]} />
          <View style={[styles.cornerAccent, styles.cornerBL]} />

          <Animated.View style={[styles.heroContent, heroStyle]}>
            <View style={styles.eyebrow}>
              <View style={styles.eyebrowLine} />
              <Text style={styles.eyebrowText}>مجوهرات ميشيل</Text>
              <View style={styles.eyebrowLine} />
            </View>

            <Text style={styles.heroHeadline}>
              <Text style={styles.heroHeadlineGold}>ذهب</Text>
              {'\n'}خالص
            </Text>

            <Text style={styles.heroSub}>
              أجود المشغولات الذهبية{'\n'}بأسعار السوق لحظة بلحظة
            </Text>

            <View style={styles.ctaRow}>
              <Pressable
                style={styles.ctaSecondary}
                onPress={() => router.push('/(tabs)/gold-prices')}
              >
                <Text style={styles.ctaSecondaryText}>أسعار اليوم</Text>
              </Pressable>

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
            </View>

            <View style={styles.heroStats}>
              <HeroStat value="+٥٠٠" label="قطعة" />
              <View style={styles.heroStatDivider} />
              <HeroStat value="٣" label="عيارات" />
              <View style={styles.heroStatDivider} />
              <HeroStat value="١٠٠٪" label="ذهب حقيقي" />
            </View>
          </Animated.View>
        </View>

        {/* ══════════════════════════════════════════════════════
            GOLD TICKER
        ══════════════════════════════════════════════════════ */}
        <Animated.View style={[styles.section, sec1Style]}>
          {gold ? (
            <GlassCard variant="gold" style={styles.ticker}>
              <View style={styles.tickerHead}>
                <View style={styles.tickerStatus}>
                  <View style={styles.dotContainer}>
                    <Animated.View style={[styles.pulseDot, pulseStyle, {
                      backgroundColor: gold.isMarketOpen ? Colors.open : Colors.closed,
                    }]} />
                    <View style={[styles.statusDot, {
                      backgroundColor: gold.isMarketOpen ? Colors.open : Colors.closed,
                    }]} />
                  </View>
                  <Text style={[styles.statusText, {
                    color: gold.isMarketOpen ? Colors.open : Colors.closed,
                  }]}>
                    {gold.isMarketOpen ? 'السوق مفتوح' : 'السوق مغلق'}
                  </Text>
                </View>
                <Text style={styles.tickerTitle}>أسعار الذهب اليوم</Text>
              </View>

              <View style={styles.tickerPrices}>
                <TickerPrice karat="24K" price={gold.karat24} prev={gold.prev24} bright label="ذهب خالص" />
                <View style={styles.tickerDivider} />
                <TickerPrice karat="21K" price={gold.karat21} prev={gold.prev21} label="الأكثر شيوعاً" />
                <View style={styles.tickerDivider} />
                <TickerPrice karat="18K" price={gold.karat18} prev={gold.prev18} label="عصري وأنيق" />
              </View>

              <View style={styles.tickerFooter}>
                <Text style={styles.tickerNote}>السعر بالجنيه المصري / للجرام</Text>
                <Pressable onPress={() => router.push('/(tabs)/gold-prices')}>
                  <Text style={styles.tickerLink}>عرض كل الأسعار ←</Text>
                </Pressable>
              </View>
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
            {(['ring', 'necklace', 'bracelet', 'earrings', 'bar'] as ProductType[]).map((t, i) => (
              <View key={t} style={{ transform: [{ scaleX: -1 }] }}>
                <CategoryPill type={t} staggerIndex={i} />
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* ══════════════════════════════════════════════════════
            FEATURED PRODUCTS
        ══════════════════════════════════════════════════════ */}
        <Animated.View style={[styles.section, sec2Style]}>
          <View style={styles.sectionHeader}>
            <Pressable onPress={() => router.push('/(tabs)/catalog')}>
              <Text style={styles.sectionLink}>عرض الكل ←</Text>
            </Pressable>
            <Text style={styles.sectionTitle}>أحدث الإضافات</Text>
          </View>

          {isLoading ? (
            <ScrollView
              horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featRow}
            >
              {[0, 1, 2, 3].map(i => <SkeletonCard key={i} index={i} />)}
            </ScrollView>
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
        <Animated.View style={[styles.section, sec3Style]}>
          <Text style={styles.sectionTitle}>تصفح حسب العيار</Text>
          <View style={styles.karatGrid}>
            {(['24K', '21K', '18K'] as const).map((k, i) => (
              <KaratTile key={k} karat={k} index={i} goldData={gold} />
            ))}
          </View>
        </Animated.View>

        {/* ══════════════════════════════════════════════════════
            STORE SECTION
        ══════════════════════════════════════════════════════ */}
        <Animated.View style={[styles.section, sec4Style]}>
          <Text style={styles.sectionTitle}>فرعنا</Text>
          <Pressable
            onPress={() => router.push('/(tabs)/store')}
            style={styles.storeCard}
          >
            <LinearGradient
              colors={['rgba(200,149,44,0.12)', 'rgba(200,149,44,0.04)']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.storeGrad}
            >
              <View style={styles.storeLeft}>
                <Text style={styles.storePin}>📍</Text>
              </View>
              <View style={styles.storeInfo}>
                <Text style={styles.storeName}>مجوهرات ميشيل</Text>
                <Text style={styles.storeAddress}>القاهرة، مصر</Text>
                <Text style={styles.storeHours}>السبت — الخميس: 10ص — 10م</Text>
              </View>
              <Text style={styles.storeArrow}>←</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <View style={hs.wrap}>
      <Text style={hs.value}>{value}</Text>
      <Text style={hs.label}>{label}</Text>
    </View>
  );
}
const hs = StyleSheet.create({
  wrap: { alignItems: 'center' },
  value: { color: Colors.goldBright, fontSize: FontSize.lg, fontWeight: '900' },
  label: { color: 'rgba(255,255,255,0.55)', fontSize: 10, marginTop: 2 },
});

// ─────────────────────────────────────────────────────────────────────────────
function TickerPrice({ karat, price, prev, bright, label }: {
  karat: string; price: number; prev?: number | null; bright?: boolean; label?: string;
}) {
  const diff = prev != null && prev !== 0 ? price - prev : null;
  const pct  = diff != null && prev ? ((diff / prev) * 100).toFixed(2) : null;
  const up   = diff != null && diff > 0;
  const down = diff != null && diff < 0;

  return (
    <View style={tp.wrap}>
      {/* Change indicator row */}
      {pct != null && diff !== 0 ? (
        <View style={tp.changeRow}>
          <Text style={[tp.arrow, up ? tp.arrowUp : tp.arrowDown]}>
            {up ? '▲' : '▼'}
          </Text>
          <Text style={[tp.pct, up ? tp.pctUp : tp.pctDown]}>
            {Math.abs(Number(pct))}٪
          </Text>
        </View>
      ) : (
        <View style={tp.changeRow}>
          <Text style={tp.stable}>—</Text>
        </View>
      )}
      <Text style={[tp.price, bright && tp.bright]}>
        {price?.toLocaleString('en-US') ?? '---'}
      </Text>
      <Text style={tp.karat}>{karat}</Text>
      {label && <Text style={tp.label}>{label}</Text>}
    </View>
  );
}
const tp = StyleSheet.create({
  wrap:      { alignItems: 'center', flex: 1, gap: 2 },
  changeRow: { flexDirection: 'row', alignItems: 'center', gap: 2, height: 16 },
  arrow:     { fontSize: 9, fontWeight: '900' },
  arrowUp:   { color: Colors.open },
  arrowDown: { color: Colors.closed },
  pct:       { fontSize: 9, fontWeight: '800' },
  pctUp:     { color: Colors.open },
  pctDown:   { color: Colors.closed },
  stable:    { fontSize: 9, color: Colors.textMuted },
  price:     { color: Colors.goldMid, fontSize: FontSize.xl, fontWeight: '900' },
  bright:    { color: Colors.goldBright, fontSize: 26 },
  karat:     { color: Colors.textPrimary, fontSize: FontSize.sm, fontWeight: '700' },
  label:     { color: Colors.textMuted, fontSize: 9, marginTop: 1 },
});

// ─────────────────────────────────────────────────────────────────────────────
function CategoryPill({ type, staggerIndex }: { type: ProductType; staggerIndex: number }) {
  const op = useSharedValue(0);
  const x = useSharedValue(-20);
  const scale = useSharedValue(1);

  useEffect(() => {
    const d = 500 + staggerIndex * 90;
    op.value = withDelay(d, withTiming(1, { duration: 360 }));
    x.value = withDelay(d, withSpring(0, { damping: 16 }));
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: op.value, transform: [{ translateX: x.value }, { scale: scale.value }] }));

  return (
    <Animated.View style={style}>
      <Pressable
        style={cp.pill}
        onPress={() => router.push({ pathname: '/(tabs)/catalog', params: { type } })}
        onPressIn={() => { scale.value = withSpring(0.93); }}
        onPressOut={() => { scale.value = withSpring(1); }}
      >
        <Text style={cp.icon}>{PRODUCT_TYPE_ICONS[type]}</Text>
        <Text style={cp.label}>{PRODUCT_TYPE_LABELS[type]}</Text>
      </Pressable>
    </Animated.View>
  );
}
const cp = StyleSheet.create({
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: Spacing.md + 2, paddingVertical: 13,
    backgroundColor: Colors.glass, borderRadius: Radius.full,
    borderWidth: 1, borderColor: Colors.glassBorder,
    minWidth: 100,
  },
  icon: { fontSize: 20 },
  label: { fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: '700' },
});

// ─────────────────────────────────────────────────────────────────────────────
function FeaturedCard({ product, index }: { product: Product; index: number }) {
  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const imgUrl = resolveImageUrl(product.images, BASE_URL)
    ?? FALLBACK[product.productType ?? 'ring']
    ?? DEMO_IMAGES.ring;

  const isNew = index < 3;

  return (
    <Animated.View style={[fc.card, aStyle]}>
      <Pressable
        onPress={() => router.push(`/product/${product.id}`)}
        onPressIn={() => { scale.value = withSpring(0.95); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={{ flex: 1 }}
      >
        <Image source={{ uri: imgUrl }} style={fc.img} contentFit="cover" transition={400} />

        <LinearGradient
          colors={['transparent', 'rgba(5,4,12,0.96)']}
          locations={[0.35, 1]}
          style={fc.grad}
        />

        {/* NEW badge */}
        {isNew && (
          <View style={fc.newBadge}>
            <Text style={fc.newText}>جديد</Text>
          </View>
        )}

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
    width: 190, borderRadius: Radius.xl, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.glassBorder, ...Shadow.card,
  },
  img: { width: 190, height: 255 },
  grad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 140 },
  info: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.sm + 2 },

  newBadge: {
    position: 'absolute', top: 10, left: 10,
    backgroundColor: Colors.open,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: Radius.full,
  },
  newText: { color: Colors.white, fontSize: 9, fontWeight: '800' },

  badge: {
    alignSelf: 'flex-end', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: Radius.full, marginBottom: 6,
  },
  badgeText: { color: Colors.white, fontSize: 10, fontWeight: '900' },
  name: {
    color: Colors.textPrimary, fontSize: FontSize.sm + 1, fontWeight: '700',
    textAlign: 'right', marginBottom: 4,
  },
  price: { color: Colors.goldBright, fontSize: FontSize.md, fontWeight: '900', textAlign: 'right' },
});

// ─────────────────────────────────────────────────────────────────────────────
const KARAT_CFG = {
  '24K': {
    colors: ['#F7D060', '#C8952C', '#A36B10'] as [string, string, string],
    sub: 'ذهب خالص',
    icon: '✦',
    description: 'أعلى نقاء',
    accentOpacity: 0.25,
  },
  '21K': {
    colors: ['#D4AF37', '#9B7319', '#6B4F0D'] as [string, string, string],
    sub: 'الأكثر شيوعاً',
    icon: '◆',
    description: 'الأنسب للمجوهرات',
    accentOpacity: 0.18,
  },
  '18K': {
    colors: ['#8B6914', '#5C4209', '#3A2805'] as [string, string, string],
    sub: 'عصري وأنيق',
    icon: '●',
    description: 'متين وعصري',
    accentOpacity: 0.12,
  },
};

function KaratTile({ karat, index, goldData }: {
  karat: '24K' | '21K' | '18K'; index: number; goldData: any;
}) {
  const scale = useSharedValue(1);
  const s = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const { colors, sub, icon, description, accentOpacity } = KARAT_CFG[karat];

  const price = goldData
    ? karat === '24K' ? goldData.karat24
      : karat === '21K' ? goldData.karat21
        : goldData.karat18
    : null;

  return (
    <Animated.View style={[kt.tile, s]}>
      <Pressable
        onPress={() => router.push({ pathname: '/(tabs)/catalog', params: { karat } })}
        onPressIn={() => { scale.value = withSpring(0.93); }}
        onPressOut={() => { scale.value = withSpring(1.00); }}
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={kt.grad}
        >
          {/* Background pattern circle */}
          <View style={[kt.bgCircle, { opacity: accentOpacity }]} />

          {/* Icon */}
          <Text style={kt.icon}>{icon}</Text>

          {/* Karat label */}
          <Text style={kt.karat}>{karat}</Text>
          <Text style={kt.sub}>{sub}</Text>
          <Text style={kt.desc}>{description}</Text>

          {/* Live price */}
          {price && (
            <View style={kt.priceWrap}>
              <Text style={kt.priceVal}>{price.toLocaleString('en-US')}</Text>
              <Text style={kt.priceUnit}>ج.م/جم</Text>
            </View>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}
const kt = StyleSheet.create({
  tile: { flex: 1, borderRadius: Radius.xl, overflow: 'hidden', ...Shadow.gold },
  grad: {
    paddingVertical: Spacing.xl, paddingHorizontal: Spacing.sm,
    alignItems: 'center', minHeight: 170, justifyContent: 'center',
    gap: 3,
  },
  bgCircle: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#fff', top: -30, right: -30,
  },
  icon: { fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 4 },
  karat: { color: Colors.white, fontSize: FontSize.xxl, fontWeight: '900', letterSpacing: 1 },
  sub: { color: 'rgba(255,255,255,0.80)', fontSize: 10, fontWeight: '700', marginTop: 2 },
  desc: { color: 'rgba(255,255,255,0.50)', fontSize: 9, marginTop: 1 },
  priceWrap: { marginTop: Spacing.sm, alignItems: 'center' },
  priceVal: { color: 'rgba(255,255,255,0.90)', fontSize: FontSize.sm, fontWeight: '800' },
  priceUnit: { color: 'rgba(255,255,255,0.50)', fontSize: 8 },
});

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },

  // ── Hero ──────────────────────────────────────────────────────────────────
  heroOuter: {
    position: 'relative', minHeight: 520,
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl,
  },
  heroBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  heroTopLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
  heroBottomLine: { position: 'absolute', bottom: Spacing.xxl, left: 0, right: 0, height: 1 },

  cornerAccent: {
    position: 'absolute', width: 32, height: 32,
    borderColor: 'rgba(200,149,44,0.40)',
  },
  cornerTR: {
    top: 16, right: 16,
    borderTopWidth: 2, borderRightWidth: 2,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: Spacing.xxl + 8, left: 16,
    borderBottomWidth: 2, borderLeftWidth: 2,
    borderBottomLeftRadius: 4,
  },

  heroContent: { alignItems: 'flex-end', paddingTop: 90 },

  eyebrow: {
    flexDirection: 'row-reverse', alignItems: 'center',
    gap: Spacing.sm, marginBottom: Spacing.md,
  },
  eyebrowLine: { flex: 1, height: 1, backgroundColor: Colors.goldBorder },
  eyebrowText: {
    color: Colors.goldMid, fontSize: FontSize.xl,
    fontWeight: '700', letterSpacing: 1,
  },

  heroHeadline: {
    color: Colors.white, fontSize: FontSize.hero + 6, fontWeight: '900',
    textAlign: 'right', lineHeight: 64, marginBottom: Spacing.md,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 16,
  },
  heroHeadlineGold: { color: Colors.goldBright },

  heroSub: {
    color: 'rgba(255,255,255,0.65)', fontSize: FontSize.sm,
    textAlign: 'right', lineHeight: 24, marginBottom: Spacing.xl,
  },

  ctaRow: {
    flexDirection: 'row-reverse', alignItems: 'center',
    gap: Spacing.md, marginBottom: Spacing.xl,
  },
  ctaWrap: { borderRadius: Radius.full, overflow: 'hidden', ...Shadow.gold },
  ctaGrad: {
    paddingVertical: 15, paddingHorizontal: Spacing.xl,
    flexDirection: 'row-reverse', alignItems: 'center', gap: 8,
  },
  ctaText: { color: Colors.bg, fontWeight: '900', fontSize: FontSize.md, letterSpacing: 0.4 },
  ctaArrow: { color: Colors.bg, fontWeight: '900', fontSize: FontSize.lg },
  ctaSecondary: {
    paddingVertical: 14, paddingHorizontal: Spacing.lg,
    borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.glassBorder,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  ctaSecondaryText: { color: Colors.textPrimary, fontWeight: '700', fontSize: FontSize.sm },

  heroStats: {
    flexDirection: 'row-reverse', alignItems: 'center',
    gap: Spacing.lg, paddingTop: Spacing.sm,
  },
  heroStatDivider: { width: 1, height: 28, backgroundColor: 'rgba(200,149,44,0.25)' },

  // ── Sections ──────────────────────────────────────────────────────────────
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

  // ── Ticker ────────────────────────────────────────────────────────────────
  ticker: { gap: Spacing.md },
  tickerHead: {
    flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center',
  },
  tickerTitle: { fontSize: FontSize.md, fontWeight: '800', color: Colors.textPrimary },
  tickerStatus: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  dotContainer: { width: 14, height: 14, justifyContent: 'center', alignItems: 'center' },
  pulseDot: { position: 'absolute', width: 14, height: 14, borderRadius: 7 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },
  tickerPrices: { flexDirection: 'row-reverse', alignItems: 'center', paddingVertical: Spacing.sm },
  tickerDivider: { width: 1, height: 44, backgroundColor: Colors.goldBorder },
  tickerFooter: {
    flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center',
  },
  tickerLink: { color: Colors.goldMid, fontSize: FontSize.sm, fontWeight: '600' },
  tickerNote: { color: Colors.textMuted, fontSize: 10 },

  // ── Pills ─────────────────────────────────────────────────────────────────
  pillsRow: { gap: Spacing.sm, paddingVertical: 4 },

  // ── Featured ──────────────────────────────────────────────────────────────
  featRow: { gap: Spacing.md, paddingBottom: 4 },

  // ── Karat grid ────────────────────────────────────────────────────────────
  karatGrid: { flexDirection: 'row-reverse', gap: Spacing.sm },

  storeCard:    { borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: Colors.goldBorder, ...Shadow.gold },
  storeGrad:    { flexDirection: 'row-reverse', alignItems: 'center', padding: Spacing.lg, gap: Spacing.md },
  storeLeft:    { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(200,149,44,0.15)', alignItems: 'center', justifyContent: 'center' },
  storePin:     { fontSize: 24 },
  storeInfo:    { flex: 1, alignItems: 'flex-end', gap: 3 },
  storeName:    { fontSize: FontSize.md, fontWeight: '800', color: Colors.textPrimary },
  storeAddress: { fontSize: FontSize.sm, color: Colors.textSecond },
  storeHours:   { fontSize: FontSize.xs, color: Colors.textMuted },
  storeArrow:   { color: Colors.goldMid, fontSize: FontSize.lg, fontWeight: '700' },
});
