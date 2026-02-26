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
  // Brand Colors - light/dark pairs from colors.js
  orange: {
    light: colors.orange.light,
    dark: colors.orange.default, // #E05A3D - the vibrant coral
  },
  blue: {
    light: colors.blue.light,
    dark: colors.blue.default, // #5865F2 - the vibrant blue
  },
  brown: {
    light: colors.brown.light,
    dark: colors.brown.dark,
  },
  green: {
    light: colors.green.light,
    dark: colors.green.dark,
  },

  // Neutrals
  beige: colors.brown.lighter,
  charcoal: '#1A1A1A', // true charcoal black

  // Error - distinct red that works on all backgrounds
  error: {
    light: colors.red.light,
    dark: colors.red.default,
  },
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
    lineHeight: 50,
  },
  h2: {
    fontFamily: fontFamilyPrimary,
    fontSize: 28,
    lineHeight: 36,
  },
  h3: {
    fontFamily: fontFamilyPrimary,
    fontSize: 20,
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
// INPUT STYLES
// ============================================
export const inputStyles = {
  // Solid: White background with subtle border (for light backgrounds)
  solid: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(197, 198, 173, 0.3)', // brown.light with opacity
  },
  // Ghost: Transparent with visible border (for dark backgrounds)
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  // Shared base styles
  base: {
    height: 48,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
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
  inputStyles,
};

export default tokens;
