import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import { I18nManager } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const isRTL = I18nManager.isRTL;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: useClientOnlyValue(false, true),
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}>
      {/* In RTL, rightmost tab is first, so we define order as [home, catalog, gold] */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'house',
                android: 'home',
                web: 'house',
              }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'المنتجات',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'square.grid.2x2',
                android: 'grid_view',
                web: 'square.grid.2x2',
              }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="gold-prices"
        options={{
          title: 'أسعار الذهب',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'chart.line.uptrend.xyaxis',
                android: 'show_chart',
                web: 'chart.line.uptrend.xyaxis',
              }}
              tintColor={color}
              size={24}
              style={isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
            />
          ),
        }}
      />
    </Tabs>
  );
}

