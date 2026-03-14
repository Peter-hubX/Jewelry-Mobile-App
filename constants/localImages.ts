// constants/localImages.ts
// ─────────────────────────────────────────────────────────────────────────────
// LOCAL IMAGE REGISTRY
//
// HOW TO ADD YOUR OWN PRODUCT IMAGES:
//
// 1. Drop image files into:
//      assets/product-images/by-id/     ← for a specific product (e.g. 42.jpg)
//      assets/product-images/rings/     ← type fallback for all rings
//      assets/product-images/necklaces/
//      assets/product-images/bracelets/
//      assets/product-images/earrings/
//      assets/product-images/bars/
//
// 2. Register them below in the matching section.
//    Use require() — Metro bundler needs static paths at build time.
//
// 3. Rebuild / reload. Done.
//
// PRIORITY ORDER (highest wins):
//   by-id entry  >  API image  >  type fallback  >  Unsplash demo
// ─────────────────────────────────────────────────────────────────────────────

import type { ProductType } from '@/types';

// ── By Product ID ────────────────────────────────────────────────────────────
// Add an entry here for each product you have a local image for.
// Key = product ID (number), Value = require() of the image.
//
// Example:
//   42:   require('../assets/product-images/by-id/42.jpg'),
//   1023: require('../assets/product-images/by-id/1023.png'),

export const LOCAL_IMAGES_BY_ID: Record<number, any> = {
  // ← paste your entries here, e.g.:
  // 1: require('../assets/product-images/by-id/1.jpg'),
};

// ── By Product Type (fallback when no API image and no by-id match) ───────────
// Add one image per type. This is shown for ALL products of that type
// when no specific image is available.
//
// Example:
//   ring: require('../assets/product-images/rings/my-ring.jpg'),

export const LOCAL_IMAGES_BY_TYPE: Partial<Record<ProductType, any>> = {
  // ring:     require('../assets/product-images/rings/...'),
  // necklace: require('../assets/product-images/necklaces/...'),
  // bracelet: require('../assets/product-images/bracelets/...'),
  // earrings: require('../assets/product-images/earrings/...'),
  // bar:      require('../assets/product-images/bars/...'),
};

// ─────────────────────────────────────────────────────────────────────────────
// resolveLocalImage
// Returns a local require() source if one exists, otherwise null.
// Usage:
//   const localSrc = resolveLocalImage(product.id, product.productType);
//   <Image source={localSrc ?? { uri: apiUrl ?? DEMO_IMAGES.ring }} />
// ─────────────────────────────────────────────────────────────────────────────
export function resolveLocalImage(
  productId: number,
  productType?: ProductType | string,
): any | null {
  // 1. Exact product ID match
  if (LOCAL_IMAGES_BY_ID[productId] != null) {
    return LOCAL_IMAGES_BY_ID[productId];
  }
  // 2. Type fallback (only if type is a known ProductType key)
  if (productType && LOCAL_IMAGES_BY_TYPE[productType as ProductType] != null) {
    return LOCAL_IMAGES_BY_TYPE[productType as ProductType];
  }
  return null;
}
