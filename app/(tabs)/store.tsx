// app/(tabs)/store.tsx
import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Pressable, Linking, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withDelay, withSpring, Easing,
} from 'react-native-reanimated';

import { AmbientBackground } from '@/components/AmbientBackground';
import { GlassCard } from '@/components/GlassCard';
import { Colors, Spacing, Radius, FontSize, Shadow } from '@/constants/theme';
import { hapticLight, hapticMedium } from '@/utils/haptics';

// ── Store data — update these when needed ─────────────────────────────────────
const STORE = {
  nameAr: 'مجوهرات ميشيل',
  nameEn: 'Michiel Jewelry',
  address: 'القاهرة، مصر',          // ← update with real address
  phone: '+20 101 071 3400',       // ← update with real phone
  googleMapsUrl: 'https://maps.google.com/?q=مجوهرات+ميشيل+القاهرة', // ← update with real coords
  hours: [
    { day: 'السبت — الخميس', time: '10:00 ص — 10:00 م' },
    { day: 'الجمعة', time: '2:00 م — 10:00 م' },
  ],
  socials: {
    whatsapp: 'https://wa.me/201010713400',
    // instagram: 'https://instagram.com/michiel_jewelry',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
export default function StoreScreen() {
  const insets = useSafeAreaInsets();

  const op1 = useSharedValue(0);
  const op2 = useSharedValue(0);
  const op3 = useSharedValue(0);
  const y1 = useSharedValue(24);

  useEffect(() => {
    op1.value = withDelay(80, withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) }));
    y1.value = withDelay(80, withSpring(0, { damping: 16, stiffness: 120 }));
    op2.value = withDelay(260, withTiming(1, { duration: 400 }));
    op3.value = withDelay(420, withTiming(1, { duration: 400 }));
  }, []);

  const s1 = useAnimatedStyle(() => ({ opacity: op1.value, transform: [{ translateY: y1.value }] }));
  const s2 = useAnimatedStyle(() => ({ opacity: op2.value }));
  const s3 = useAnimatedStyle(() => ({ opacity: op3.value }));

  function openMaps() {
    hapticMedium();
    Linking.openURL(STORE.googleMapsUrl);
  }

  function callStore() {
    hapticLight();
    Linking.openURL(`tel:${STORE.phone.replace(/\s/g, '')}`);
  }

  function openWhatsApp() {
    hapticMedium();
    Linking.openURL(STORE.socials.whatsapp);
  }

  return (
    <View style={styles.root}>
      <AmbientBackground />

      <ScrollView
        style={{ flex: 1, zIndex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <Animated.View style={[styles.header, { paddingTop: insets.top + Spacing.xl }, s1]}>
          {/* Gold map pin icon */}
          <View style={styles.pinWrap}>
            <LinearGradient
              colors={[Colors.goldLight, Colors.gold, Colors.goldDark]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.pinCircle}
            >
              <Text style={styles.pinEmoji}>📍</Text>
            </LinearGradient>
          </View>

          <Text style={styles.storeName}>{STORE.nameAr}</Text>
          <Text style={styles.storeNameEn}>{STORE.nameEn}</Text>
          <Text style={styles.storeAddress}>{STORE.address}</Text>
        </Animated.View>

        {/* ── Action buttons ── */}
        <Animated.View style={[styles.section, s2]}>
          <View style={styles.actionsRow}>
            {/* Open in Maps */}
            <Pressable style={styles.actionBtn} onPress={openMaps}>
              <LinearGradient
                colors={[Colors.goldLight, Colors.gold, Colors.goldDark]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.actionGrad}
              >
                <Text style={styles.actionIcon}>🗺️</Text>
                <Text style={styles.actionLabel}>فتح الخريطة</Text>
              </LinearGradient>
            </Pressable>

            {/* Call */}
            <Pressable style={[styles.actionBtn, styles.actionBtnGlass]} onPress={callStore}>
              <Text style={styles.actionIcon}>📞</Text>
              <Text style={[styles.actionLabel, styles.actionLabelGlass]}>اتصل بنا</Text>
            </Pressable>

            {/* WhatsApp */}
            <Pressable style={[styles.actionBtn, styles.actionBtnWa]} onPress={openWhatsApp}>
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={[styles.actionLabel, { color: '#fff' }]}>واتساب</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* ── Opening hours ── */}
        <Animated.View style={[styles.section, s3]}>
          <Text style={styles.sectionTitle}>مواعيد العمل</Text>
          <GlassCard noPadding style={styles.hoursCard}>
            {STORE.hours.map((h, i) => (
              <View key={i}>
                {i > 0 && <View style={styles.divider} />}
                <View style={styles.hoursRow}>
                  <Text style={styles.hoursTime}>{h.time}</Text>
                  <Text style={styles.hoursDay}>{h.day}</Text>
                </View>
              </View>
            ))}
          </GlassCard>
        </Animated.View>

        {/* ── Info cards ── */}
        <Animated.View style={[styles.section, s3]}>
          <Text style={styles.sectionTitle}>معلومات الفرع</Text>
          <View style={styles.infoGrid}>
            <InfoCard icon="💳" title="طرق الدفع" value="كاش — فيزا" />
            <InfoCard icon="🔒" title="الضمان" value="ضمان أصالة الذهب" />
            <InfoCard icon="🎁" title="التغليف" value="تغليف هدايا مجاني" />
            <InfoCard icon="⚖️" title="الوزن" value="بالميزان الدقيق" />
          </View>
        </Animated.View>

        {/* ── Phone number display ── */}
        <Animated.View style={[styles.section, s3]}>
          <GlassCard variant="gold" style={styles.phoneCard}>
            <Text style={styles.phoneLabel}>للتواصل المباشر</Text>
            <Pressable onPress={callStore}>
              <Text style={styles.phoneNumber}>{STORE.phone}</Text>
            </Pressable>
            <Text style={styles.phoneNote}>اضغط للاتصال</Text>
          </GlassCard>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function InfoCard({ icon, title, value }: { icon: string; title: string; value: string }) {
  return (
    <GlassCard style={ic.card} noPadding>
      <View style={ic.inner}>
        <Text style={ic.icon}>{icon}</Text>
        <Text style={ic.value}>{value}</Text>
        <Text style={ic.title}>{title}</Text>
      </View>
    </GlassCard>
  );
}
const ic = StyleSheet.create({
  card: { width: '47%' },
  inner: { padding: Spacing.md, alignItems: 'flex-end' },
  icon: { fontSize: 22, marginBottom: 8 },
  value: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary, textAlign: 'right', marginBottom: 3 },
  title: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'right' },
});

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },

  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  pinWrap: { marginBottom: Spacing.lg },
  pinCircle: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.gold,
  },
  pinEmoji: { fontSize: 32 },
  storeName: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.textPrimary, marginBottom: 4 },
  storeNameEn: { fontSize: FontSize.sm, color: Colors.goldMid, fontWeight: '600', marginBottom: 8 },
  storeAddress: { fontSize: FontSize.md, color: Colors.textSecond, textAlign: 'center' },

  section: { paddingHorizontal: Spacing.lg, marginTop: Spacing.xl },
  sectionTitle: {
    fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary,
    textAlign: 'right', marginBottom: Spacing.md,
  },

  actionsRow: { flexDirection: 'row-reverse', gap: Spacing.sm },
  actionBtn: {
    flex: 1, borderRadius: Radius.lg, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: Spacing.lg,
    ...Shadow.gold,
  },
  actionBtnGlass: {
    backgroundColor: Colors.glass,
    borderWidth: 1, borderColor: Colors.glassBorder,
    ...Shadow.card,
  },
  actionBtnWa: {
    backgroundColor: '#25D366',
  },
  actionGrad: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.lg, gap: 4 },
  actionIcon: { fontSize: 22 },
  actionLabel: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.bg },
  actionLabelGlass: { color: Colors.textPrimary },

  hoursCard: {},
  hoursRow: {
    flexDirection: 'row-reverse', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 14, paddingHorizontal: Spacing.md,
  },
  hoursDay: { fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: '600' },
  hoursTime: { fontSize: FontSize.sm, color: Colors.goldMid, fontWeight: '700' },
  divider: { height: 1, backgroundColor: Colors.divider, marginHorizontal: Spacing.md },

  infoGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: Spacing.sm },

  phoneCard: { alignItems: 'center', gap: 6 },
  phoneLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  phoneNumber: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.goldBright, letterSpacing: 1 },
  phoneNote: { fontSize: 10, color: Colors.textMuted },
});
