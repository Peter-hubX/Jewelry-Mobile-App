// context/WishlistContext.tsx
import React, { createContext, useContext } from 'react';
import { useWishlist } from '@/hooks/useWishlist';
import type { Product } from '@/types';

type WishlistCtx = {
  wishlist: Product[];
  isWishlisted: (id: number) => boolean;
  toggle: (product: Product) => void;
  remove: (id: number) => void;
  clear: () => void;
  loaded: boolean;
};

const WishlistContext = createContext<WishlistCtx | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const value = useWishlist();
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistContext() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlistContext must be used inside WishlistProvider');
  return ctx;
}
