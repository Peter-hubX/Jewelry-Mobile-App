import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  I18nManager,
  Pressable,
  StyleSheet,
  TextInput,
  View as RNView,
} from 'react-native';
import { router } from 'expo-router';

import { Text, View } from '@/components/Themed';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/types';

const isRTL = I18nManager.isRTL;

export default function CatalogScreen() {
  const [search, setSearch] = useState('');
  const [karat, setKarat] = useState<'24K' | '21K' | '18K' | undefined>();

  const { data, isLoading, isError } = useProducts({
    search,
    karat,
  });

  const products = data ?? [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>المنتجات</Text>
      <Text style={styles.subtitle}>شبكات، خواتم، أساور، سلاسل وأكثر</Text>

      <RNView style={styles.filtersRow}>
        <TextInput
          style={[styles.searchInput, isRTL && styles.searchInputRtl]}
          placeholder="ابحث باسم المنتج"
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={search}
          onChangeText={setSearch}
          textAlign="right"
        />
      </RNView>

      <RNView style={styles.karatRow}>
        {(['24K', '21K', '18K'] as const).map((k) => {
          const active = karat === k;
          return (
            <Pressable
              key={k}
              style={[styles.karatChip, active && styles.karatChipActive]}
              onPress={() => setKarat(active ? undefined : k)}>
              <Text style={styles.karatText}>{k}</Text>
            </Pressable>
          );
        })}
      </RNView>

      {isLoading && (
        <RNView style={styles.center}>
          <ActivityIndicator />
        </RNView>
      )}

      {isError && !isLoading && (
        <RNView style={styles.center}>
          <Text>تعذر تحميل المنتجات</Text>
        </RNView>
      )}

      {!isLoading && !isError && (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => <ProductCard product={item} />}
          inverted={isRTL}
        />
      )}
    </View>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Pressable style={styles.card} onPress={() => router.push(`/product/${product.id}`)}>
      <RNView style={styles.cardImagePlaceholder} />
      <Text style={styles.cardName} numberOfLines={1}>
        {product.nameAr}
      </Text>
      <Text style={styles.cardPrice}>{product.calculatedPrice.toLocaleString('en-US')} EGP</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'right',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'right',
    marginBottom: 16,
  },
  filtersRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  searchInputRtl: {
    textAlign: 'right',
  },
  karatRow: {
    flexDirection: 'row-reverse',
    gap: 8,
    marginBottom: 12,
  },
  karatChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  karatChipActive: {
    backgroundColor: 'rgba(184,134,11,0.15)',
    borderColor: '#B8860B',
  },
  karatText: {
    fontSize: 13,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '47%',
  },
  cardImagePlaceholder: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginBottom: 8,
  },
  cardName: {
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
});


