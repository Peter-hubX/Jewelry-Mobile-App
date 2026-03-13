# Michiel Jewelry — Mobile App

React Native + Expo mobile app for iOS & Android. Arabic-first, RTL, guest browsing.  
Consumes the existing Next.js backend — no new server needed.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set your API URL (local dev — your machine IP, not localhost, for physical device)
# Edit app.json → extra.apiUrl  OR  create a .env file:
echo 'EXPO_PUBLIC_API_URL=http://192.168.1.x:3000' > .env

# 3. Start
npx expo start

# Scan the QR code with Expo Go (iOS) or the Expo Go app (Android)
```

> **Important for physical devices:** `localhost` only works on simulators.  
> Use your local network IP (e.g. `192.168.1.42`) when testing on a real phone.

---

## Project Structure

```
app/
  _layout.tsx          Root layout — RTL, QueryClient, StatusBar
  (tabs)/
    _layout.tsx        Tab bar — dark gold theme
    index.tsx          Home screen — hero, ticker, featured products
    catalog.tsx        Product grid — search, karat filter, price sort
    gold-prices.tsx    Live gold prices — 24K/21K/18K EGP
  product/[id].tsx     Product detail — image, specs, price breakdown
  +not-found.tsx       404 screen

constants/
  theme.ts             Colors, spacing, radius, font sizes, shadows

hooks/
  useProducts.ts       Fetch + filter products via TanStack Query
  useGoldPrice.ts      Fetch live gold price, auto-refresh every 60s

services/
  api.ts               Typed fetch wrapper — reads BASE_URL from env/app.json

types/
  index.ts             Product, GoldPrice, Karat types
```

---

## Features Implemented

| Feature | Status |
|---------|--------|
| Arabic RTL layout (all screens) | ✅ |
| Home hero with live gold ticker | ✅ |
| Karat quick-filter cards on home | ✅ |
| Featured products horizontal scroll | ✅ |
| Product catalog grid | ✅ |
| Arabic text search | ✅ |
| Filter by karat (24K / 21K / 18K) | ✅ |
| Sort by price (asc / desc) | ✅ |
| Product card with image + out-of-stock | ✅ |
| Product detail — image, specs, breakdown | ✅ |
| Live gold price — 24K / 21K / 18K | ✅ |
| Market open/closed status | ✅ |
| Auto-refresh gold prices (60s) | ✅ |
| Error states + retry buttons | ✅ |
| Dark gold tab bar | ✅ |
| Safe area handling (notch / home bar) | ✅ |

---

## RTL Checklist (verify on real device)

Before submitting to stores, test each item on a real Arabic-locale device.

### Layout
- [ ] `I18nManager.forceRTL(true)` — verify by checking `I18nManager.isRTL === true` at runtime
- [ ] Tab bar order: الرئيسية (right) → المنتجات → أسعار الذهب (left)
- [ ] All text aligns right
- [ ] Product grid flows right-to-left
- [ ] Karat badges on cards appear on the correct (left) side
- [ ] Back arrow on product detail points right (←) and tapping it goes back

### Navigation
- [ ] Home → Catalog (tap "تصفح المنتجات") — navigates correctly
- [ ] Home → Catalog pre-filtered by karat (tap karat card) — filter applied
- [ ] Home → Gold prices (tap banner) — navigates correctly
- [ ] Catalog → Product detail (tap any card) — opens correctly
- [ ] Product detail back button — returns to catalog
- [ ] Tab switching — no blank screens

### Search & Filters (Catalog)
- [ ] Arabic text search returns correct products
- [ ] Karat chip toggles filter on/off
- [ ] Multiple taps on same karat chip clears filter
- [ ] Sort dropdown opens and closes correctly
- [ ] Sort by price asc — cheapest item first
- [ ] Sort by price desc — most expensive first
- [ ] "مسح الفلاتر" button clears search + karat

### Gold Prices
- [ ] Three karat cards display with correct prices
- [ ] Market open badge shows green when open (Sun–Thu 10:00–18:00 Cairo time)
- [ ] Market closed badge shows red outside hours
- [ ] "آخر تحديث" time matches device time (±60s)
- [ ] Price refreshes automatically — watch for 60s and confirm update

### Product Detail
- [ ] Product name in Arabic on right
- [ ] Karat badge visible on image
- [ ] "نفذت الكمية" overlay shows for out-of-stock items
- [ ] Spec grid: weight, karat, craftPremium%, category
- [ ] Price breakdown section shows when gold price is loaded
- [ ] Total price matches: weight × goldPrice × (1 + craftPremium)

### Edge Cases
- [ ] No internet — error state shows with retry button
- [ ] Empty search — "لا توجد منتجات تطابق بحثك" shows
- [ ] Product with no image — emoji placeholder shows (💍)
- [ ] Very long Arabic product name — truncates with ellipsis (numberOfLines)

---

## Connecting to the Backend

The app calls these Next.js API routes:

| Route | Used by |
|-------|---------|
| `GET /api/products` | Catalog, Home featured |
| `GET /api/products/:id` | Product detail |
| `GET /api/gold-prices` | Home ticker, Gold prices screen |

### For local dev (simulator)
```
app.json → extra.apiUrl = "http://localhost:3000"
```

### For local dev (physical device, same Wi-Fi)
```
app.json → extra.apiUrl = "http://192.168.x.x:3000"
```
Find your IP: `ipconfig` (Windows) or `ifconfig | grep inet` (Mac/Linux)

### For production
```
app.json → extra.apiUrl = "https://your-domain.com"
```
Also update `eas.json` → `preview.env.EXPO_PUBLIC_API_URL` and `production.env.EXPO_PUBLIC_API_URL`.

---

## Building for Stores

### Prerequisites
```bash
npm install -g eas-cli
eas login          # Create account at expo.dev if needed
eas build:configure
```

Update `eas.json`:
- Replace `YOUR_DEPLOYED_API_URL_HERE` with your real domain
- Replace Apple/Google credentials for submission

### iOS (TestFlight)
```bash
eas build --platform ios --profile preview
# Builds in cloud — no Mac required
# Download IPA → upload to App Store Connect → TestFlight
```

### Android (Internal Testing)
```bash
eas build --platform android --profile preview
# Downloads an APK you can install directly on any Android device
```

### Production
```bash
eas build --platform all --profile production
eas submit --platform all --profile production
```

---

## What's NOT in v1 (intentional)

| Feature | Reason |
|---------|--------|
| User login / accounts | Guest browsing only for v1 |
| Online payments / cart | No payments in v1 |
| Admin panel | Not needed until admin workflow is defined |
| Push notifications | Skipped for v1 |
| Price sparkline chart | Nice-to-have, can add in v1.1 |

---

## Minimum OS Versions

| Platform | Minimum |
|----------|---------|
| iOS | 16.0 |
| Android | API 26 (Android 8.0 Oreo) |

Covers ~97% of active devices as of 2026.
