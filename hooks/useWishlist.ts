// hooks/useWishlist.ts
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Product } from '@/types';

const WISHLIST_KEY = 'michiel:wishlist';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    AsyncStorage.getItem(WISHLIST_KEY)
      .then(raw => {
        if (raw) setWishlist(JSON.parse(raw));
      })
      .catch(() => { })
      .finally(() => setLoaded(true));
  }, []);

  // Persist to storage whenever wishlist changes (after initial load)
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist)).catch(() => { });
  }, [wishlist, loaded]);

  const isWishlisted = useCallback(
    (id: number) => wishlist.some(p => p.id === id),
    [wishlist],
  );

  const toggle = useCallback((product: Product) => {
    setWishlist(prev =>
      prev.some(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product],
    );
  }, []);

  const remove = useCallback((id: number) => {
    setWishlist(prev => prev.filter(p => p.id !== id));
  }, []);

  const clear = useCallback(() => setWishlist([]), []);

  return { wishlist, isWishlisted, toggle, remove, clear, loaded };
}
