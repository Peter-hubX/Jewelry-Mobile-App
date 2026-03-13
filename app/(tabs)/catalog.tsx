// app/(tabs)/catalog.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, Pressable,
  ActivityIndicator, ScrollView, Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, Easing,
} from 'react-native-reanimated';

import { useProducts, ProductFilters } from '@/hooks/useProducts';
import { Colors, Spacing, Radius, FontSize, Shadow } from '@/constants/theme';
import { PRODUCT_TYPE_LABELS, PRODUCT_TYPE_ICONS, type ProductType } from '@/types';
import { AmbientBackground } from '@/components/AmbientBackground';
import { ProductCard } from '@/components/ProductCard';

type Sort = 'default' | 'price_asc' | 'price_desc';
const SORT_LABELS: Record<Sort, string> = {
  default: 'الافتراضي', price_asc: 'الأقل سعراً', price_desc: 'الأعلى سعراً',
};
const TYPES: ProductType[] = ['ring', 'necklace', 'bracelet', 'earrings', 'bar'];

export default function CatalogScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ karat?: string; type?: string }>();

  const [search,      setSearch]      = useState('');
  const [karat,       setKarat]       = useState<ProductFilters['karat'] | undefined>(params.karat as any);
  const [productType, setProductType] = useState<ProductType | undefined>(params.type as any);
  const [sort,        setSort]        = useState<Sort>('default');
  const [showSort,    setShowSort]    = useState(false);

  const fadeIn = useSharedValue(0);
  useEffect(() => { fadeIn.value = withTiming(1, { duration: 460, easing: Easing.out(Easing.quad) }); }, []);
  const fadeStyle = useAnimatedStyle(() => ({ opacity: fadeIn.value }));

  const { data, isLoading, isError, refetch } = useProducts({ search, karat, productType });

  const sorted = useMemo(() => {
    if (!data) return [];
    if (sort === 'price_asc')  return [...data].sort((a, b) => a.calculatedPrice - b.calculatedPrice);
    if (sort === 'price_desc') return [...data].sort((a, b) => b.calculatedPrice - a.calculatedPrice);
    return data;
  }, [data, sort]);

  const toggleKarat = useCallback((k: ProductFilters['karat']) =>
    setKarat(p => p === k ? undefined : k), []);
  const toggleType = useCallback((t: ProductType) =>
    setProductType(p => p === t ? undefined : t), []);
  const clearAll = useCallback(() => {
    setSearch(''); setKarat(undefined); setProductType(undefined); setSort('default');
  }, []);

  const hasFilter = !!(search || karat || productType || sort !== 'default');

  return (
    <View style={styles.root}>
      <AmbientBackground />

      <Animated.View style={[styles.inner, fadeStyle]}>

        {/* ── Header ── */}
        <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>

          {/* Title row */}
          <View style={styles.titleRow}>
            <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={14}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
            <Text style={styles.title}>المنتجات</Text>
            <View style={styles.titleRight}>
              {hasFilter && (
                <Pressable onPress={clearAll}>
                  <Text style={styles.clearBtn}>مسح</Text>
                </Pressable>
              )}
              {!isLoading && (
                <Text style={styles.count}>{sorted.length}</Text>
              )}
            </View>
          </View>

          {/* Search bar */}
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="ابحث باسم المنتج..."
              placeholderTextColor={Colors.textMuted}
              value={search}
              onChangeText={setSearch}
              textAlign="right"
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>

          {/* Category pills */}
          <ScrollView
            horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsRow}
            style={{ transform: [{ scaleX: -1 }] }}
          >
            {TYPES.map(t => {
              const active = productType === t;
              return (
                <View key={t} style={{ transform: [{ scaleX: -1 }] }}>
                  <Pressable
                    style={[styles.pill, active && styles.pillOn]}
                    onPress={() => toggleType(t)}
                  >
                    <Text style={styles.pillIcon}>{PRODUCT_TYPE_ICONS[t]}</Text>
                    <Text style={[styles.pillText, active && styles.pillTextOn]}>
                      {PRODUCT_TYPE_LABELS[t]}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </ScrollView>

          {/* Karat chips + sort */}
          <View style={styles.filterRow}>
            <View style={styles.karatGroup}>
              {(['24K','21K','18K'] as const).map(k => {
                const active = karat === k;
                return (
                  <Pressable
                    key={k}
                    style={[styles.chip, active && styles.chipOn]}
                    onPress={() => toggleKarat(k)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextOn]}>{k}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable style={styles.sortBtn} onPress={() => setShowSort(v => !v)}>
              <Text style={styles.sortBtnText}>
                {sort === 'default' ? '↕ ترتيب' : SORT_LABELS[sort]}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Sort dropdown */}
        {showSort && (
          <View style={styles.dropdown}>
            {(Object.keys(SORT_LABELS) as Sort[]).map(opt => (
              <Pressable
                key={opt}
                style={[styles.dropItem, sort === opt && styles.dropItemOn]}
                onPress={() => { setSort(opt); setShowSort(false); }}
              >
                <Text style={[styles.dropText, sort === opt && styles.dropTextOn]}>
                  {SORT_LABELS[opt]}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Loading */}
        {isLoading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.gold} />
            <Text style={styles.centerText}>جاري التحميل...</Text>
          </View>
        )}

        {/* Error */}
        {isError && !isLoading && (
          <View style={styles.center}>
            <Text style={styles.emptyEmoji}>⚠️</Text>
            <Text style={styles.centerText}>تعذر تحميل المنتجات</Text>
            <Pressable style={styles.actionBtn} onPress={() => refetch()}>
              <Text style={styles.actionBtnText}>إعادة المحاولة</Text>
            </Pressable>
          </View>
        )}

        {/* Empty */}
        {!isLoading && !isError && sorted.length === 0 && (
          <View style={styles.center}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.centerText}>لا توجد منتجات مطابقة</Text>
            <Pressable style={styles.actionBtn} onPress={clearAll}>
              <Text style={styles.actionBtnText}>مسح الفلاتر</Text>
            </Pressable>
          </View>
        )}

        {/* Grid */}
        {!isLoading && !isError && sorted.length > 0 && (
          <ScrollView
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.gridRow}>
              {sorted.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </View>
          </ScrollView>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:  { flex: 1, backgroundColor: Colors.bg },
  inner: { flex: 1, zIndex: 1 },

  header: {
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.glassBorder,
    gap: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between',
  },
  title: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.textPrimary },
  titleRight: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, minWidth: 60 },
  count: { fontSize: FontSize.sm, color: Colors.textMuted },
  clearBtn: { fontSize: FontSize.sm, color: Colors.goldMid, fontWeight: '700' },
  backBtn: {
    width: 36, height: 36, borderRadius: Radius.full,
    backgroundColor: Colors.glass, borderWidth: 1, borderColor: Colors.glassBorder,
    justifyContent: 'center', alignItems: 'center',
  },
  backArrow: { color: Colors.textPrimary, fontSize: 18, fontWeight: '700', lineHeight: 20 },

  searchBar: {
    flexDirection: 'row-reverse', alignItems: 'center',
    backgroundColor: Colors.glass, borderRadius: Radius.full,
    borderWidth: 1, borderColor: Colors.glassBorder,
    paddingHorizontal: Spacing.md,
  },
  searchIcon:  { fontSize: 14, marginLeft: 6 },
  searchInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 11 : 9,
    fontSize: FontSize.md, color: Colors.textPrimary, textAlign: 'right',
  },

  pillsRow: { gap: Spacing.sm, paddingVertical: 2 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: Spacing.md, paddingVertical: 8,
    backgroundColor: Colors.glass, borderRadius: Radius.full,
    borderWidth: 1, borderColor: Colors.glassBorder,
  },
  pillOn:      { backgroundColor: Colors.glassGold, borderColor: Colors.glassGoldBorder },
  pillIcon:    { fontSize: 13 },
  pillText:    { fontSize: 12, color: Colors.textSecond, fontWeight: '600' },
  pillTextOn:  { color: Colors.goldLight },

  filterRow:   { flexDirection: 'row-reverse', alignItems: 'center', gap: Spacing.sm },
  karatGroup:  { flexDirection: 'row-reverse', gap: 6, flex: 1 },
  chip: {
    paddingHorizontal: Spacing.md, paddingVertical: 7,
    borderRadius: Radius.full, borderWidth: 1.5,
    borderColor: Colors.glassBorder, backgroundColor: Colors.glass,
  },
  chipOn:      { backgroundColor: Colors.glassGold, borderColor: Colors.goldBorder },
  chipText:    { fontSize: 12, color: Colors.textSecond, fontWeight: '700' },
  chipTextOn:  { color: Colors.goldLight },
  sortBtn: {
    paddingHorizontal: Spacing.md, paddingVertical: 7,
    borderRadius: Radius.full, borderWidth: 1.5,
    borderColor: Colors.glassBorder, backgroundColor: Colors.glass, maxWidth: 120,
  },
  sortBtnText: { fontSize: 11, color: Colors.textSecond, fontWeight: '600' },

  dropdown: {
    position: 'absolute', top: 232, left: Spacing.lg, right: Spacing.lg,
    backgroundColor: Colors.surfaceAlt, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.glassBorder, zIndex: 100, ...Shadow.card,
  },
  dropItem: {
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1, borderBottomColor: Colors.divider,
  },
  dropItemOn:  { backgroundColor: Colors.glassGold },
  dropText:    { fontSize: FontSize.md, color: Colors.textPrimary, textAlign: 'right' },
  dropTextOn:  { color: Colors.goldLight, fontWeight: '700' },

  grid:        { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: 100 },
  gridRow:     { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: Spacing.md },

  center:      { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 80 },
  centerText:  { color: Colors.textSecond, fontSize: FontSize.md, marginTop: Spacing.md, textAlign: 'center' },
  emptyEmoji:  { fontSize: 48, marginBottom: Spacing.md },
  actionBtn: {
    marginTop: Spacing.md, backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.full,
  },
  actionBtnText: { color: Colors.white, fontWeight: '800', fontSize: FontSize.sm },
});
