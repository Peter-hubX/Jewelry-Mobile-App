import Constants from 'expo-constants';

import type { GoldPrice, Product } from '@/types';

const BASE_URL =
  (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl ??
  process.env.EXPO_PUBLIC_API_URL ??
  'http://localhost:3000';

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    throw new Error(`Request failed with ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  products: {
    list: (params?: string) =>
      json<Product[]>(`${BASE_URL}/api/products${params ? `?${params}` : ''}`),
    detail: (id: number | string) => json<Product>(`${BASE_URL}/api/products/${id}`),
  },
  goldPrice: {
    live: () => json<GoldPrice>(`${BASE_URL}/api/gold-prices`),
  },
};

