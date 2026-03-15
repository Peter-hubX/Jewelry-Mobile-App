// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs, router } from 'expo-router';
import { Text, View, Pressable, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring,
} from 'react-native-reanimated';
import { useWishlistContext } from '@/context/WishlistContext';
import { Colors } from '@/constants/theme';
import { hapticLight } from '@/utils/haptics';

// ─── Wishlist heart button ────────────────────────────────────────────────────
function WishlistHeaderButton() {
  const { wishlist } = useWishlistContext();
  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const count = wishlist.length;

  return (
    <Animated.View style={[aStyle, { marginLeft: 16 }]}>
      <Pressable
        onPress={() => { hapticLight(); router.push('/wishlist'); }}
        onPressIn={() => { scale.value = withSpring(0.88); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={hdr.btn}
        hitSlop={10}
      >
        <StarIcon filled={count > 0} />
        {count > 0 && (
          <View style={hdr.badge}>
            <Text style={hdr.badgeText}>{count > 9 ? '9+' : count}</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <Text style={{ fontSize: 22, color: filled ? Colors.gold : 'rgba(255,255,255,0.90)' }}>
      {filled ? '⭐' : '☆'}
    </Text>
  );
}

const hdr = StyleSheet.create({
  btn:       { padding: 4 },
  badge:     {
    position: 'absolute', top: -2, right: -2,
    backgroundColor: Colors.gold,
    width: 16, height: 16, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { color: Colors.bg, fontSize: 9, fontWeight: '900' },
});

// ─── Tab icon ─────────────────────────────────────────────────────────────────
function TabIcon({ emoji, active }: {
  emoji: string; color: string; size: number; active: boolean;
}) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', opacity: active ? 1 : 0.5 }}>
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
    </View>
  );
}

// ─── Blurred tab bar background ───────────────────────────────────────────────
function TabBarBackground() {
  return (
    <BlurView
      intensity={Platform.OS === 'ios' ? 80 : 60}
      tint="dark"
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: 'rgba(11,11,18,0.72)' },
      ]}
    />
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Transparent header — only used to host wishlist button
        headerShown:        true,
        headerTransparent:  true,
        headerTitle:        '',
        headerRight:        () => <WishlistHeaderButton />,
        headerStyle:        { backgroundColor: 'transparent' },
        headerShadowVisible: false,

        // Blurred tab bar
        tabBarActiveTintColor:   Colors.goldLight,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 1,
          borderTopColor: 'rgba(200,149,44,0.15)',
          position: 'absolute',
          elevation: 0,
        },
        tabBarBackground:    () => <TabBarBackground />,
        tabBarLabelStyle:    { fontSize: 11, fontWeight: '700', marginTop: 2 },
        tabBarItemStyle:     { paddingTop: 8 },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon emoji="🏠" color={color} size={size} active={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'المنتجات',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon emoji="💍" color={color} size={size} active={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="gold-prices"
        options={{
          title: 'أسعار الذهب',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon emoji="📈" color={color} size={size} active={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
