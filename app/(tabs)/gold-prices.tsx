// app/(tabs)/gold-prices.tsx
import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  ActivityIndicator, Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withDelay, withTiming, withSpring, Easing,
} from 'react-native-reanimated';

import { useGoldPrice } from '@/hooks/useGoldPrice';
import { Colors, Spacing, Radius, FontSize, Shadow } from '@/constants/theme';
import { AmbientBackground } from '@/components/AmbientBackground';
import { GlassCard } from '@/components/GlassCard';

const KARATS = [
  {
    key:    'karat24' as const,
    label:  '24 قيراط',
    sub:    'ذهب خالص · للاستثمار والسبائك',
    colors: [Colors.surfaceAlt, '#1A1A2A'] as [string, string],
    accent: Colors.goldLight,
  },
  {
    key:    'karat21' as const,
    label:  '21 قيراط',
    sub:    'الأكثر شيوعاً في المجوهرات',
    colors: [Colors.surfaceAlt, '#252538'] as [string, string],
    accent: Colors.goldLight,
  },
  {
    key:    'karat18' as const,
    label:  '18 قيراط',
    sub:    'للمجوهرات الرفيعة العصرية',
    colors: ['#181828', Colors.surface] as [string, string],
    accent: Colors.goldMid,
  },
] as const;

export default function GoldPricesScreen() {
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError, refetch, dataUpdatedAt } = useGoldPrice();

  const updatedTime = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    : null;

  // Header entrance
  const hOp = useSharedValue(0);
  const hY  = useSharedValue(-18);
  useEffect(() => {
    hOp.value = withTiming(1, { duration: 480, easing: Easing.out(Easing.quad) });
    hY.value  = withSpring(0, { damping: 16 });
  }, []);
  const headerStyle = useAnimatedStyle(() => ({
    opacity: hOp.value, transform: [{ translateY: hY.value }],
  }));

  return (
    <View style={styles.root}>
      <AmbientBackground />

      <ScrollView style={{ flex: 1, zIndex: 1 }} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <Animated.View style={headerStyle}>
          <LinearGradient
            colors={['rgba(200,149,44,0.13)', 'transparent']}
            style={[styles.header, { paddingTop: insets.top + Spacing.md }]}
          >
            {/* Gold shimmer top edge */}
            <LinearGradient
              colors={[Colors.goldBorder, 'transparent']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.headerLine}
            />

            {/* Back button */}
            <Pressable
              style={styles.backBtn}
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/(tabs)');
                }
              }}
              hitSlop={14}
            >
              <Text style={styles.backArrow}>←</Text>
            </Pressable>

            <Text style={styles.headerTitle}>أسعار الذهب</Text>
            <Text style={styles.headerSub}>السوق المصري · جنيه / جرام</Text>

            {data && (
              <View style={[styles.marketBadge, {
                backgroundColor: data.isMarketOpen ? Colors.openBg : Colors.closedBg,
                borderColor:     data.isMarketOpen ? Colors.open   : Colors.closed,
              }]}>
                <View style={[styles.dot, {
                  backgroundColor: data.isMarketOpen ? Colors.open : Colors.closed,
                }]} />
                <Text style={[styles.marketText, {
                  color: data.isMarketOpen ? Colors.open : Colors.closed,
                }]}>
                  {data.isMarketOpen ? 'السوق مفتوح الآن' : 'السوق مغلق'}
                </Text>
              </View>
            )}
          </LinearGradient>
        </Animated.View>

        {/* Loading */}
        {isLoading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.gold} />
            <Text style={styles.centerText}>جاري تحميل الأسعار...</Text>
          </View>
        )}

        {/* Error */}
        {isError && !isLoading && (
          <View style={styles.center}>
            <Text style={styles.errEmoji}>⚠️</Text>
            <Text style={styles.centerText}>تعذر تحميل الأسعار</Text>
            <Pressable style={styles.retryBtn} onPress={() => refetch()}>
              <Text style={styles.retryText}>إعادة المحاولة</Text>
            </Pressable>
          </View>
        )}

        {/* Cards */}
        {data && !isLoading && !isError && (
          <View style={styles.cards}>
            {KARATS.map((cfg, i) => {
              const prevKey = cfg.key === 'karat24' ? 'prev24' : cfg.key === 'karat21' ? 'prev21' : 'prev18';
              return (
                <KaratCard
                  key={cfg.key}
                  label={cfg.label}
                  sub={cfg.sub}
                  price={data[cfg.key]}
                  prev={(data as any)[prevKey] ?? null}
                  colors={cfg.colors}
                  accent={cfg.accent}
                  isOpen={data.isMarketOpen}
                  index={i}
                />
              );
            })}

            {/* Stats row */}
            <GlassCard noPadding style={styles.statsRow}>
              <StatCell label="آخر تحديث" value={updatedTime ?? '--:--'} />
              <View style={styles.statsDivider} />
              <StatCell label="تحديث كل" value="60 ث" />
              <View style={styles.statsDivider} />
              <StatCell label="العملة" value="EGP" />
            </GlassCard>

            <Text style={styles.disclaimer}>
              * الأسعار استرشادية وتُحدَّث من السوق المصري. قد تختلف أسعار البيع الفعلية بحسب المصنعية وعيار المنتج.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function KaratCard({ label, sub, price, prev, colors, accent, isOpen, index }: {
  label: string; sub: string; price: number; prev?: number | null;
  colors: [string, string]; accent: string;
  isOpen: boolean; index: number;
}) {
  const diff = prev != null && prev !== 0 ? price - prev : null;
  const pct  = diff != null && prev ? ((diff / prev) * 100).toFixed(2) : null;
  const up   = diff != null && diff > 0;
  const down = diff != null && diff < 0;
  const op = useSharedValue(0);
  const y  = useSharedValue(32);
  useEffect(() => {
    op.value = withDelay(index * 130, withTiming(1, { duration: 480 }));
    y.value  = withDelay(index * 130, withSpring(0, { damping: 15 }));
  }, []);
  const s = useAnimatedStyle(() => ({ opacity: op.value, transform: [{ translateY: y.value }] }));

  return (
    <Animated.View style={s}>
      <LinearGradient
        colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.karatCard}
      >
        {/* Inner top shimmer */}
        <LinearGradient
          colors={['rgba(255,255,255,0.075)', 'transparent']}
          style={styles.karatShimmer}
        />
        {/* Gold top border */}
        <View style={[styles.karatTopBorder, { backgroundColor: accent, opacity: 0.55 }]} />

        <View style={styles.karatBody}>
          <View style={styles.karatRight}>
            <Text style={styles.karatLabel}>{label}</Text>
            <Text style={styles.karatSub}>{sub}</Text>
          </View>
          <View style={styles.karatLeft}>
            <View style={styles.priceRow}>
              <Text style={[styles.karatPrice, { color: accent }]}>
                {price?.toLocaleString('en-US') ?? '---'}
              </Text>
              {pct != null && diff !== 0 && (
                <View style={[styles.changePill, up ? styles.changePillUp : styles.changePillDown]}>
                  <Text style={[styles.changeText, up ? styles.changeUp : styles.changeDown]}>
                    {up ? '▲' : '▼'} {Math.abs(Number(pct))}٪
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.karatUnit}>جنيه / جم</Text>
          </View>
        </View>

        <View style={styles.karatFooter}>
          <View style={[styles.dot, { backgroundColor: isOpen ? Colors.open : 'rgba(255,255,255,0.18)' }]} />
          <Text style={styles.karatFooterText}>{isOpen ? 'سعر حي' : 'آخر سعر مسجل'}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCell}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },

  header: {
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl, alignItems: 'flex-end',
    position: 'relative',
  },
  headerLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 1 },
  backBtn: {
    alignSelf: 'flex-end', marginBottom: Spacing.md,
    width: 36, height: 36, borderRadius: Radius.full,
    backgroundColor: Colors.glass, borderWidth: 1, borderColor: Colors.glassBorder,
    justifyContent: 'center', alignItems: 'center',
  },
  backArrow:   { color: Colors.textPrimary, fontSize: 18, fontWeight: '700', lineHeight: 20 },
  headerTitle: { fontSize: FontSize.xxxl, fontWeight: '900', color: Colors.textPrimary, marginBottom: 4 },
  headerSub:   { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: Spacing.md },
  marketBadge: {
    flexDirection: 'row-reverse', alignItems: 'center', gap: 6,
    paddingHorizontal: Spacing.md, paddingVertical: 6,
    borderRadius: Radius.full, borderWidth: 1,
  },
  dot:        { width: 7, height: 7, borderRadius: 4 },
  marketText: { fontSize: FontSize.sm, fontWeight: '700' },

  cards: { padding: Spacing.lg, gap: Spacing.md },

  karatCard:   { borderRadius: Radius.xl, overflow: 'hidden', ...Shadow.gold },
  karatShimmer:{ position: 'absolute', top: 0, left: 0, right: 0, height: 56 },
  karatTopBorder: { position: 'absolute', top: 0, left: 0, right: 0, height: 1.5 },
  karatBody: {
    flexDirection: 'row-reverse', justifyContent: 'space-between',
    alignItems: 'center', padding: Spacing.lg,
  },
  karatRight:  { alignItems: 'flex-end', flex: 1 },
  karatLabel:  { fontSize: FontSize.xl, fontWeight: '900', color: Colors.white, marginBottom: 5 },
  karatSub:    { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.52)', textAlign: 'right', maxWidth: 160 },
  karatLeft:   { alignItems: 'flex-start' },
  priceRow:    { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  karatPrice:  { fontSize: 32, fontWeight: '900', letterSpacing: -0.6 },
  changePill:  { paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.sm, marginLeft: 8 },
  changePillUp:   { backgroundColor: 'rgba(74,222,128,0.15)' },
  changePillDown: { backgroundColor: 'rgba(248,113,113,0.15)' },
  changeText:  { fontSize: 12, fontWeight: '800' },
  changeUp:    { color: Colors.open },
  changeDown:  { color: Colors.closed },
  karatUnit:   { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.50)', marginTop: 3 },
  karatFooter: {
    flexDirection: 'row-reverse', alignItems: 'center', gap: 6,
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
  },
  karatFooterText: { fontSize: 11, color: 'rgba(255,255,255,0.38)' },

  statsRow:     { flexDirection: 'row-reverse' },
  statCell:     { flex: 1, alignItems: 'center', paddingVertical: Spacing.md },
  statValue:    { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: 3 },
  statLabel:    { fontSize: 10, color: Colors.textMuted, textAlign: 'center' },
  statsDivider: { width: 1, backgroundColor: Colors.divider, marginVertical: Spacing.md },

  disclaimer: { fontSize: 11, color: Colors.textMuted, textAlign: 'right', lineHeight: 18 },

  center:      { paddingVertical: Spacing.xxl, alignItems: 'center' },
  centerText:  { marginTop: Spacing.md, color: Colors.textMuted, fontSize: FontSize.sm },
  errEmoji:    { fontSize: 40, marginBottom: Spacing.md },
  retryBtn: {
    marginTop: Spacing.md, backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.full,
  },
  retryText:   { color: Colors.white, fontWeight: '800', fontSize: FontSize.sm },
});
