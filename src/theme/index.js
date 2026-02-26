/**
 * Hactually 2.0 Theme System
 * LEAN Design Tokens
 */

// LEAN tokens (primary exports)
export { color, spacing, radius, typography, inputStyles } from './tokens';
import { color, spacing, radius, typography, inputStyles } from './tokens';

// Ghost theme context (for automatic ghost variant theming)
export { GhostTheme, useGhostTheme, DarkGreenTheme, DarkBlueTheme, DarkOrangeTheme, DarkBrownTheme } from './GhostTheme';

// Core exports (still needed by components)
export { colors, gradients } from './colors';
export { shadows } from './shadows';
export { fontFamily, fontFamilySecondary, fontSize } from './typography';
export { borderRadius } from './spacing';

import { colors, gradients } from './colors';
import { shadows } from './shadows';
import { fontFamily, fontFamilySecondary, fontSize } from './typography';
import { borderRadius } from './spacing';

// Combined theme object
const theme = {
  // LEAN tokens
  color,
  spacing,
  radius,
  typography,
  inputStyles,
  // Core
  colors,
  gradients,
  shadows,
  fontFamily,
  fontFamilySecondary,
  fontSize,
  borderRadius,
};

export default theme;
