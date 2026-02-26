/**
 * Hactually 2.0 Typography System
 * Ezra Bold for headlines, System font for body
 */

// Primary font - Ezra Bold for headlines and display
// Other weights fallback to system for consistency
export const fontFamily = {
  bold: 'Ezra-Bold',
  // Fallbacks to system font (for backward compatibility)
  regular: 'System',
  medium: 'System',
  black: 'Ezra-Bold', // Use bold as black fallback
};

// Secondary font - System font for body text and UI
// iOS: San Francisco, Android: Roboto
export const fontFamilySecondary = {
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
};

// Font sizes based on actual app usage
export const fontSize = {
  xs: 11,      // button text, uppercase labels
  sm: 12,      // captions, small labels
  base: 14,    // body text, inputs
  lg: 28,      // titles, headings
  xl: 40,      // display, hero text
};

// Line heights matched to font sizes
export const lineHeight = {
  xs: 14,
  sm: 16,
  base: 20,
  lg: 36,
  xl: 50,
};

// Pre-built text styles
export const textStyles = {
  // Headlines - Ezra Bold
  display: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
    fontWeight: '700',
  },
  heading: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
    fontWeight: '700',
  },
  // Body - System font
  body: {
    fontFamily: fontFamilySecondary.regular,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    fontWeight: '400',
  },
  caption: {
    fontFamily: fontFamilySecondary.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    fontWeight: '400',
  },
  button: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
};

export default {
  fontFamily,
  fontFamilySecondary,
  fontSize,
  lineHeight,
  textStyles,
};
