// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { I18nManager, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:   Colors.goldLight,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          position: 'absolute',
          elevation: 0,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['transparent', 'rgba(11,11,18,0.97)']}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
        tabBarItemStyle: { paddingTop: 8 },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color, size }) => (
            <TabIcon emoji="🏠" color={color} size={size} active={color === Colors.goldLight} />
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'المنتجات',
          tabBarIcon: ({ color, size }) => (
            <TabIcon emoji="💍" color={color} size={size} active={color === Colors.goldLight} />
          ),
        }}
      />
      <Tabs.Screen
        name="gold-prices"
        options={{
          title: 'أسعار الذهب',
          tabBarIcon: ({ color, size }) => (
            <TabIcon emoji="📈" color={color} size={size} active={color === Colors.goldLight} />
          ),
        }}
      />

    </Tabs>
  );
}

import { Text, View } from 'react-native';
function TabIcon({ emoji, active }: { emoji: string; color: string; size: number; active: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', opacity: active ? 1 : 0.5 }}>
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
    </View>
  );
}
