// app/+not-found.tsx
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';

export default function NotFoundScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.icon}>🔍</Text>
      <Text style={styles.title}>الصفحة غير موجودة</Text>
      <Text style={styles.sub}>عذراً، لم نتمكن من إيجاد هذه الصفحة</Text>
      <Pressable style={styles.btn} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.btnText}>العودة للرئيسية</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  icon:  { fontSize: 60, marginBottom: Spacing.lg },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary, marginBottom: Spacing.sm, textAlign: 'center' },
  sub:   { fontSize: FontSize.md, color: Colors.textMuted, textAlign: 'center', marginBottom: Spacing.xl },
  btn:   { backgroundColor: Colors.gold, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: Radius.full },
  btnText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.md },
});
