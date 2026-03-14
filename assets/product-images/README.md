# Product Images Folder

Drop your product photos here. The app will automatically pick them up.

## How to add images

### Option A — By product type (applies to all products of that type as fallback)
Drop images into the matching folder:
  assets/product-images/rings/        → خواتم
  assets/product-images/necklaces/    → قلائد
  assets/product-images/bracelets/    → أساور
  assets/product-images/earrings/     → حلقان
  assets/product-images/bars/         → سبائك

Name them anything: photo1.jpg, ring-gold.jpg, etc.
The app will pick the FIRST image in each folder for that type.

### Option B — By product ID (most specific, overrides everything else)
Drop an image into:
  assets/product-images/by-id/

Name it exactly as the product ID: 42.jpg, 42.png, 1023.webp
This overrides type fallback AND the API image for that specific product.

## Priority order (highest wins)
  1. by-id/{productId}.jpg/png/webp
  2. API image (from your backend)
  3. {type}/first-image-found.jpg
  4. Unsplash demo image (hardcoded fallback)

## Supported formats
  .jpg  .jpeg  .png  .webp

## After adding images
No code change needed. Just rebuild/reload the app.
