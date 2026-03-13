// hooks/useGoldPrice.ts
import { useQuery } from '@tanstack/react-query';

import { api } from '@/services/api';
import type { GoldPrice } from '@/types';

export function useGoldPrice() {
  return useQuery<GoldPrice>({
    queryKey: ['gold-price'],
    queryFn: api.goldPrice.live,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
    staleTime: 55_000,
  });
}
