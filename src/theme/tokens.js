/**
 * Hactually LEAN Design Tokens
 * Semantic tokens ONLY - devs never see primitives
 */
import { colors } from './colors';

// ============================================
// COLOR TOKENS
// References colors.js (single source of truth)
// ============================================
export const color = {
  // Brand Colors
  orange: {
    light: colors.orange.light,
    dark: colors.orange.default,
  },
  blue: {
    light: colors.blue.light,
    dark: colors.blue.default,
  },
  brown: {
    light: colors.brown.light,
    dark: colors.brown.default,
  },
  green: {
    light: colors.green.light,
    dark: colors.green.default,
  },

  // Neutrals
  beige: colors.brown.lighter,
  charcoal: colors.brown.dark,
};

// ============================================
// SPACING TOKENS
// ============================================
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
};

// ============================================
// RADIUS TOKENS
// ============================================
export const radius = {
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
};

// ============================================
// TYPOGRAPHY TOKENS
// ============================================
const fontFamilyPrimary = 'Ezra-Bold';
const fontFamilyBody = 'System';

export const typography = {
  h1: {
    fontFamily: fontFamilyPrimary,
    fontSize: 40,
    fontWeight: '700',
    lineHeight: 50,
  },
  h2: {
    fontFamily: fontFamilyPrimary,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  h3: {
    fontFamily: fontFamilyPrimary,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  body: {
    fontFamily: fontFamilyBody,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyStrong: {
    fontFamily: fontFamilyBody,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  caption: {
    fontFamily: fontFamilyBody,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  button: {
    fontFamily: fontFamilyPrimary,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
};

// ============================================
// DEFAULT EXPORT
// ============================================
const tokens = {
  color,
  spacing,
  radius,
  typography,
};

export default tokens;
