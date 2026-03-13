// types/index.ts
export type Karat = '24K' | '21K' | '18K';
export type ProductType = 'ring' | 'necklace' | 'bracelet' | 'earrings' | 'bar';

export type Product = {
  id: number;
  name: string;
  nameAr: string;
  description?: string;
  descriptionAr?: string;
  weight: number;
  karat: Karat;
  craftPremium: number;
  images: string[];
  category: string;
  categoryNameAr?: string;
  inStock: boolean;
  featured?: boolean;
  calculatedPrice: number;
  productType?: ProductType;
};

export type GoldPrice = {
  karat24: number;
  karat21: number;
  karat18: number;
  currency: 'EGP';
  updatedAt: string;
  isMarketOpen: boolean;
};

/** Resolve first image to absolute URL; returns null if none */
export function resolveImageUrl(
  images: string[] | undefined,
  baseUrl: string,
): string | null {
  if (!images?.length) return null;
  const first = images[0];
  if (!first) return null;
  return first.startsWith('http') ? first : `${baseUrl}${first}`;
}

// Arabic labels — bracelets are gold bangles, NOT watches
export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  ring:     'خواتم',
  necklace: 'قلائد',
  bracelet: 'أساور ذهب',
  earrings: 'حلقان',
  bar:      'سبائك',
};

// Emoji icons — bracelet uses correct gold bangle icon
export const PRODUCT_TYPE_ICONS: Record<ProductType, string> = {
  ring:     '💍',
  necklace: '📿',
  bracelet: '🪙',   // gold coin → best available emoji for gold bangle
  earrings: '✨',
  bar:      '🥇',
};
