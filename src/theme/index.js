/**
 * Hactually 2.0 Theme System
 * LEAN Design Tokens - Semantic only
 */

// New LEAN tokens (preferred)
export { color, spacing, radius, typography } from './tokens';
import { color, spacing, radius, typography } from './tokens';

// Legacy exports (for backward compatibility during migration)
export { colors, gradients } from './colors';
export { fontFamily, fontFamilySecondary, fontSize, lineHeight, textStyles } from './typography';
export { borderRadius } from './spacing';
export { shadows } from './shadows';
export { logoPath, logoAspectRatio, logoSizes, logoColors, appIconVariants, appIconContainerSizes } from './brand';

// Legacy imports
import { colors, gradients } from './colors';
import { fontFamily, fontFamilySecondary, fontSize, lineHeight, textStyles } from './typography';
import { borderRadius } from './spacing';
import { shadows } from './shadows';
import { logoPath, logoAspectRatio, logoSizes, logoColors, appIconVariants, appIconContainerSizes } from './brand';

// Combined theme object
const theme = {
  // LEAN tokens
  color,
  spacing,
  radius,
  typography,
  // Legacy (remove after migration)
  colors,
  gradients,
  fontFamily,
  fontFamilySecondary,
  fontSize,
  lineHeight,
  textStyles,
  borderRadius,
  shadows,
  logoPath,
  logoAspectRatio,
  logoSizes,
  logoColors,
  appIconVariants,
  appIconContainerSizes,
};

export default theme;
