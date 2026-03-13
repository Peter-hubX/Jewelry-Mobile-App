// constants/theme.ts
// ─────────────────────────────────────────────────────────────────────────────
// LUXURY DARK JEWELRY PALETTE — 2025/26
//
// Research-backed direction:
//   • Deep near-black base (#0B0B12) with warm undertone — not cold blue/black
//   • Rich purple-midnight accent (#2D1B5E) for depth & mystery
//   • Warm gold (#C8952C → #F0C060) as the hero accent — jewellery-grade warmth
//   • Glassmorphism cards: rgba white overlay + 1px border shimmer
//   • Inspired by: ARORA JEWELS Behance, luxury dark editorial sites on Dribbble
// ─────────────────────────────────────────────────────────────────────────────

export const Colors = {
  // ── Backgrounds ──────────────────────────────────────────────────────────
  bg:         '#0B0B12',   // Warm near-black — not a cold navy
  bgDeep:     '#060608',
  surface:    '#141420',   // Raised surface
  surfaceAlt: '#1B1B2C',
  purpleMid:  '#2D1B5E',   // Deep royal purple orb colour
  purpleDeep: '#1A1035',

  // ── Glass cards ──────────────────────────────────────────────────────────
  glass:        'rgba(255,255,255,0.055)',
  glassBorder:  'rgba(255,255,255,0.09)',
  glassStrong:  'rgba(255,255,255,0.095)',
  glassGold:    'rgba(200,149,44,0.08)',
  glassGoldBorder: 'rgba(200,149,44,0.28)',

  // ── Gold ─────────────────────────────────────────────────────────────────
  gold:        '#C8952C',   // Warm antique gold
  goldMid:     '#DBA83A',
  goldLight:   '#F0C060',   // Bright highlight
  goldBright:  '#FFD580',   // Maximum shine — use sparingly
  goldDark:    '#7A5618',
  goldFaint:   'rgba(200,149,44,0.09)',
  goldBorder:  'rgba(200,149,44,0.30)',
  goldGlow:    'rgba(200,149,44,0.22)',

  // ── Ambient orbs ─────────────────────────────────────────────────────────
  orbGold:    'rgba(200,149,44,0.16)',
  orbPurple:  'rgba(80,45,160,0.22)',
  orbRose:    'rgba(160,60,100,0.10)',  // Subtle warmth

  // ── Text ─────────────────────────────────────────────────────────────────
  white:       '#FFFFFF',
  textPrimary: '#EDE8DF',   // Warm cream — feels like parchment/luxury
  textSecond:  '#9C9080',
  textMuted:   '#5A5248',

  // ── Status ───────────────────────────────────────────────────────────────
  open:     '#52C47A',
  openBg:   'rgba(82,196,122,0.11)',
  closed:   '#E05555',
  closedBg: 'rgba(224,85,85,0.11)',

  // ── Dividers ─────────────────────────────────────────────────────────────
  border:   'rgba(255,255,255,0.065)',
  divider:  'rgba(255,255,255,0.045)',
};

// Karat multipliers for price calculation
export const KaratPremiums: Record<'24K' | '21K' | '18K', number> = {
  '24K': 1.03,
  '21K': 1.20,
  '18K': 1.25,
};

// ─────────────────────────────────────────────────────────────────────────────
// DEMO IMAGES — verified Unsplash photo IDs (free, no attribution required)
// Format: https://images.unsplash.com/photo-{ID}?w=600&q=85&fit=crop
//
// All gold jewelry.  Bracelets = gold chain bracelets (NOT watches).
// ─────────────────────────────────────────────────────────────────────────────
const UP = (id: string, w = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=85&fit=crop&auto=format`;

export const DEMO_IMAGES = {
  // Gold rings on dark/marble surface
  ring:      UP('1605100804763-247f67b3557e'),
  ring2:     UP('1573408301185-9519f94815b1'),
  ring3:     UP('1515562141207-7a88fb7ce338', 400),  // engagement ring close-up

  // Gold necklaces
  necklace:  UP('1599643478518-a784e5dc4c8f'),
  necklace2: UP('1611591437281-460bfbe1220a'),

  // Gold bracelets (chain/bangle — NOT watches)
  bracelet:  UP('1602173574767-37ac01994b2a'),
  bracelet2: UP('1506630448388-4e683c67ddb0'),

  // Earrings
  earrings:  UP('1635767798638-3e25273a8236'),
  earrings2: UP('1561861422-a549073e547a'),

  // Gold bars / investment
  bar:       UP('1610375461246-83df859d849d'),

  // Hero — luxury dark jewelry editorial
  hero:      UP('1506630448388-4e683c67ddb0', 900),

  // Texture used as card background
  goldTexture: UP('1610375461246-83df859d849d', 400),
};

// ─────────────────────────────────────────────────────────────────────────────
export const Spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 52,
};

export const Radius = {
  sm: 8, md: 14, lg: 20, xl: 28, xxl: 36, full: 999,
};

export const FontSize = {
  xs: 11, sm: 13, md: 15, lg: 17, xl: 21, xxl: 27, xxxl: 34, hero: 52,
};

export const Shadow = {
  gold: {
    shadowColor: '#C8952C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 10,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.40,
    shadowRadius: 18,
    elevation: 12,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
  purple: {
    shadowColor: '#5030A0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 8,
  },
};
