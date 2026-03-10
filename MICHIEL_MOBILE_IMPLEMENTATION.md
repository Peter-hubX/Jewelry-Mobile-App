## Michiel Jewelry Mobile App – Implementation Notes

This document tracks how the React Native + Expo mobile app is implemented in this repo, based on the March 2026 build plan, with a few scoped adjustments:

- **Platform**: iOS & Android (Expo).
- **Stack**: React Native, Expo Router, TanStack Query, Zustand, MMKV, expo-image, i18next.
- **Auth model**: **Guest browsing only** for v1 (no customer login).
- **Admin**: No public admin UI or roles in v1 (can be added later as a hidden area).
- **Notifications**: No push notifications in v1.
- **Payments**: No online payments in v1.
- **Language**: Arabic-first UI, RTL, Arabic search (plus English for numbers/karats).

### Folder & Project Location

- Web app: `Jewelry-Shop-main` root (existing Next.js 15 app).
- Mobile app: `Jewelry-Shop-main/michiel-jewelry-app` (Expo project created with the `tabs` template).

The mobile app consumes the existing Next.js API; it does **not** add a new backend.

### Phase 1 – Foundation & Architecture (in progress)

**Goals**

- Expo app runs on device via Expo Go.
- RTL enforced globally so Arabic reads right-to-left.
- Basic design system for colors, spacing, and typography.
- Navigation skeleton using Expo Router with placeholder screens.

**Key implementation decisions**

- Use Expo Router’s default `_layout.tsx` as the root layout.
- Add RTL configuration early in the app lifecycle using `I18nManager.allowRTL/forceRTL`.
- Introduce a shared `constants/theme.ts` module for colors and karat premiums.
- Create placeholder routes for:
  - Home (`app/(tabs)/index.tsx`)
  - Catalog (`app/(tabs)/catalog.tsx`)
  - Gold prices (`app/(tabs)/gold-prices.tsx`)
  - Product detail (`app/product/[id].tsx`)

### Phase 2 – API Layer & Data (in progress)

**What’s implemented**

- Added `@tanstack/react-query` to the Expo app and wrapped the navigation tree in a `QueryClientProvider` in `app/_layout.tsx`.
- Created shared TypeScript types in `types/index.ts` for `Product`, `GoldPrice`, and `Karat`.
- Implemented a minimal API client in `services/api.ts` that targets:
  - `GET /api/products`
  - `GET /api/products/:id`
  - `GET /api/gold-prices`
- API base URL resolution:
  - Reads from `expo-constants` extra `apiUrl` if present.
  - Falls back to `process.env.EXPO_PUBLIC_API_URL`.
  - Defaults to `http://localhost:3000` for local development.

Later phases (catalog, gold prices, admin, deployment) will be documented here as they are implemented.

