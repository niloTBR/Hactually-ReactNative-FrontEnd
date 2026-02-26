/**
 * Hactually 2.0 Brand Tokens
 * Logo sizes, colors, and variant definitions
 */
import { colors } from './colors';

// Logo SVG path
export const logoPath = "M96 64C96 99.3462 67.3462 128 32 128H0V0H96V64ZM192 128H96V64C96 28.6538 124.654 0 160 0H192V128Z";

// Logo aspect ratio (width:height = 1.5:1)
export const logoAspectRatio = 1.5;

// Logo size presets
export const logoSizes = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
  xxl: 96,
};

// Logo color variants
export const logoColors = {
  // Light variants (for dark backgrounds)
  light: {
    orange: colors.orange.light,
    blue: colors.blue.light,
    brown: colors.brown.light,
    green: colors.green.light,
  },
  // Dark variants (for light backgrounds)
  dark: {
    orange: colors.orange.default,
    blue: colors.blue.default,
    brown: colors.brown.default,
    green: colors.green.default,
  },
};

// App icon configurations (background + foreground pairs)
export const appIconVariants = {
  light: {
    orange: { bg: colors.orange.light, fg: colors.orange.default },
    blue: { bg: colors.blue.light, fg: colors.blue.default },
    brown: { bg: colors.brown.light, fg: colors.brown.dark },
    green: { bg: colors.green.light, fg: colors.green.dark },
  },
  dark: {
    orange: { bg: colors.orange.default, fg: colors.orange.light },
    blue: { bg: colors.blue.default, fg: colors.blue.light },
    brown: { bg: colors.brown.dark, fg: colors.brown.light },
    green: { bg: colors.green.dark, fg: colors.green.light },
  },
};

// App icon container sizes (for export reference)
export const appIconContainerSizes = {
  sm: { size: 60, borderRadius: 14 },
  md: { size: 80, borderRadius: 20 },
  lg: { size: 120, borderRadius: 28 },
  xl: { size: 180, borderRadius: 40 },
};

const brand = {
  logoPath,
  logoAspectRatio,
  logoSizes,
  logoColors,
  appIconVariants,
  appIconContainerSizes,
};

export default brand;
