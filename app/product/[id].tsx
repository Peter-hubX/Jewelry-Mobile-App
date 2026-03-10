import { ActivityIndicator, StyleSheet, View as RNView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { Text, View } from '@/components/Themed';
import { api } from '@/services/api';
import type { Product } from '@/types';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const productId = Number(id);

  const { data, isLoading, isError } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: () => api.products.detail(productId),
    enabled: !Number.isNaN(productId),
  });

  return (
    <View style={styles.container}>
      {isLoading && (
        <RNView style={styles.center}>
          <ActivityIndicator />
        </RNView>
      )}

      {isError && !isLoading && (
        <RNView style={styles.center}>
          <Text>تعذر تحميل المنتج</Text>
        </RNView>
      )}

      {data && !isLoading && !isError && (
        <>
          <Text style={styles.title}>{data.nameAr}</Text>
          <Text style={styles.subtitle}>
            {data.karat} · {data.weight} جم
          </Text>
          <Text style={styles.price}>{data.calculatedPrice.toLocaleString('en-US')} EGP</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'right',
  },
});


