// services/api.ts
import Constants from 'expo-constants';
import type { GoldPrice, Product } from '@/types';

export const BASE_URL: string =
  process.env.EXPO_PUBLIC_API_URL ??
  (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl ??
  'http://localhost:3000';

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input as RequestInfo, init);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

function normaliseProduct(raw: any): Product {
  const karatMap: Record<number, '18K' | '21K' | '24K'> = { 18: '18K', 21: '21K', 24: '24K' };
  return {
    ...raw,
    karat: karatMap[raw.karat as number] ?? `${raw.karat}K`,
    images: Array.isArray(raw.images) ? raw.images : [],
    calculatedPrice: raw.calculatedPrice ?? raw.price ?? 0,
    category: raw.category?.nameAr ?? raw.category ?? '',
  };
}

function normaliseGoldPrice(raw: any): GoldPrice {
  const data = raw.data || raw;
  return {
    karat24: data.karat24Price || data.karat24 || 0,
    karat21: data.karat21Price || data.karat21 || 0,
    karat18: data.karat18Price || data.karat18 || 0,
    currency: data.currency || 'EGP',
    updatedAt: data.lastUpdated || data.updatedAt || new Date().toISOString(),
    isMarketOpen: data.isMarketOpen ?? true,
  };
}

export const api = {
  products: {
    list: (params?: string) =>
      json<any[]>(`${BASE_URL}/api/products${params ? `?${params}` : ''}`)
        .then(items => items.map(normaliseProduct)),
    // IDs are cuid strings — pass as-is, do NOT convert to Number
    detail: (id: string) =>
      json<any>(`${BASE_URL}/api/products/${id}`).then(normaliseProduct),
  },
  goldPrice: {
    live: () => json<any>(`${BASE_URL}/api/gold-prices`).then(normaliseGoldPrice),
  },
};