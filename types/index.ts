export type Karat = '24K' | '21K' | '18K';

export type Product = {
  id: number;
  name: string;
  nameAr: string;
  weight: number;
  karat: Karat;
  craftPremium: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  calculatedPrice: number;
};

export type GoldPrice = {
  karat24: number;
  karat21: number;
  karat18: number;
  currency: 'EGP';
  updatedAt: string;
  isMarketOpen: boolean;
};

