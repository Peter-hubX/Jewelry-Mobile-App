// hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Product, ProductType } from '@/types';

export type ProductFilters = {
  karat?: '18K' | '21K' | '24K';
  productType?: ProductType;
  search?: string;
};

function buildQS(f: ProductFilters) {
  const p = new URLSearchParams();
  if (f.karat)       p.set('karat',  f.karat.replace('K', ''));
  if (f.productType) p.set('type',   f.productType);
  if (f.search)      p.set('search', f.search.trim());
  return p.toString();
}

export function useProducts(filters: ProductFilters = {}) {
  const qs = buildQS(filters);
  return useQuery<Product[]>({
    queryKey: ['products', qs],
    queryFn:  () => api.products.list(qs),
    staleTime: 60_000,
  });
}
