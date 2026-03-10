import { ActivityIndicator, StyleSheet, View as RNView } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useGoldPrice } from '@/hooks/useGoldPrice';

export default function GoldPricesScreen() {
  const { data, isLoading, isError } = useGoldPrice();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>أسعار الذهب</Text>
      <Text style={styles.subtitle}>24 / 21 / 18 قيراط بالعملة المحلية</Text>

      {isLoading && (
        <RNView style={styles.center}>
          <ActivityIndicator />
        </RNView>
      )}

      {isError && !isLoading && (
        <RNView style={styles.center}>
          <Text>تعذر تحميل الأسعار</Text>
        </RNView>
      )}

      {data && !isLoading && !isError && (
        <RNView style={styles.cardsColumn}>
          <KaratCard label="24 قيراط" price={data.karat24} />
          <KaratCard label="21 قيراط" price={data.karat21} />
          <KaratCard label="18 قيراط" price={data.karat18} />

          <Text style={styles.meta}>
            آخر تحديث: {new Date(data.updatedAt).toLocaleTimeString('ar-EG')}{' '}
            {data.isMarketOpen ? ' · السوق مفتوح' : ' · السوق مغلق'}
          </Text>
        </RNView>
      )}
    </View>
  );
}

function KaratCard({ label, price }: { label: string; price: number }) {
  return (
    <RNView style={styles.karatCard}>
      <Text style={styles.karatLabel}>{label}</Text>
      <Text style={styles.karatPrice}>{price.toLocaleString('en-US')} EGP / جم</Text>
    </RNView>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardsColumn: {
    gap: 12,
  },
  karatCard: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  karatLabel: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 4,
  },
  karatPrice: {
    fontSize: 14,
    textAlign: 'right',
  },
  meta: {
    marginTop: 16,
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'right',
  },
});


