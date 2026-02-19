/**
 * Hactually 2.0 Typography System
 * Using Ezra font family (custom) with system fallbacks
 */

export const fontFamily = {
  regular: 'Ezra-Regular',
  medium: 'Ezra-Medium',
  bold: 'Ezra-Bold',
  black: 'Ezra-Black',
  // Fallback to system fonts
  system: 'System',
};

export const fontSize = {
  xs: 12,      // captions, labels
  sm: 14,      // secondary text
  base: 16,    // body text
  lg: 20,      // subheadings
  xl: 24,      // headings
  '2xl': 32,   // large headings
  '3xl': 40,   // display
};

export const lineHeight = {
  xs: 15,
  sm: 20,
  base: 24,
  lg: 28,
  xl: 31,
  '2xl': 38,
  '3xl': 44,
};

// Pre-built text styles
export const textStyles = {
  display: {
    fontSize: fontSize['3xl'],
    lineHeight: lineHeight['3xl'],
    fontWeight: '900',
  },
  heading: {
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight['2xl'],
    fontWeight: '700',
  },
  title: {
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
    fontWeight: '500',
  },
  body: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    fontWeight: '400',
  },
  small: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    fontWeight: '400',
  },
  caption: {
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    fontWeight: '400',
  },
};

export default {
  fontFamily,
  fontSize,
  lineHeight,
  textStyles,
};
