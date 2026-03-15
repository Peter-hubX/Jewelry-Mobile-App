// hooks/useGoldPrice.ts
import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { api } from '@/services/api';
import type { GoldPrice } from '@/types';

export type GoldPriceWithDiff = GoldPrice & {
  prev24: number | null;
  prev21: number | null;
  prev18: number | null;
};

export function useGoldPrice() {
  const prevRef = useRef<{ karat24: number; karat21: number; karat18: number } | null>(null);

  return useQuery<GoldPriceWithDiff>({
    queryKey: ['gold-price'],
    queryFn: async () => {
      const data = await api.goldPrice.live();
      const prev = prevRef.current;

      const result: GoldPriceWithDiff = {
        ...data,
        prev24: prev?.karat24 ?? null,
        prev21: prev?.karat21 ?? null,
        prev18: prev?.karat18 ?? null,
      };

      // Store current as previous for next fetch
      prevRef.current = {
        karat24: data.karat24,
        karat21: data.karat21,
        karat18: data.karat18,
      };

      return result;
    },
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
    staleTime: 55_000,
  });
}
