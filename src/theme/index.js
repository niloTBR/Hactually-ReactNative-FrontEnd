/**
 * Hactually 2.0 Theme System
 * Central export for all theme values
 */

export { colors, gradients } from './colors';
export { fontFamily, fontSize, lineHeight, textStyles } from './typography';
export { spacing, borderRadius } from './spacing';
export { shadows } from './shadows';

// Combined theme object
import { colors, gradients } from './colors';
import { fontFamily, fontSize, lineHeight, textStyles } from './typography';
import { spacing, borderRadius } from './spacing';
import { shadows } from './shadows';

const theme = {
  colors,
  gradients,
  fontFamily,
  fontSize,
  lineHeight,
  textStyles,
  spacing,
  borderRadius,
  shadows,
};

export default theme;
