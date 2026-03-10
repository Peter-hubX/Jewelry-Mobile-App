import { useQuery } from '@tanstack/react-query';

import { api } from '@/services/api';
import type { Product } from '@/types';

type Filters = {
  karat?: '24K' | '21K' | '18K';
  minPrice?: number;
  maxPrice?: number;
  search?: string;
};

function buildQueryString(filters: Filters): string {
  const params = new URLSearchParams();

  if (filters.karat) params.set('karat', filters.karat);
  if (filters.minPrice) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
  if (filters.search) params.set('search', filters.search.trim());

  return params.toString();
}

export function useProducts(filters: Filters = {}) {
  const queryString = buildQueryString(filters);

  return useQuery<Product[]>({
    queryKey: ['products', queryString],
    queryFn: () => api.products.list(queryString),
  });
}

