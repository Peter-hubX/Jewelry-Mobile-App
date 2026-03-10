import { StyleSheet, View as RNView } from 'react-native';

import { Text, View } from '@/components/Themed';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <RNView style={styles.hero}>
        <Text style={styles.brand}>MICHIEL JEWELRY</Text>
        <Text style={styles.heading}>تسوق مجوهراتك الذهبية</Text>
        <Text style={styles.subheading}>تصفح أحدث التصاميم وأسعار الذهب لحظة بلحظة</Text>
      </RNView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  hero: {
    gap: 8,
    alignItems: 'flex-end',
  },
  brand: {
    fontSize: 12,
    letterSpacing: 4,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
  },
  subheading: {
    fontSize: 14,
    opacity: 0.7,
  },
});

