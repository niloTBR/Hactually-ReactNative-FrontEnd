/**
 * Hactually 2.0 Typography System
 * Ezra Bold for headlines, System font for body
 *
 * NOTE: The primary typography tokens are in tokens.js (LEAN system).
 * This file provides lower-level primitives for backward compatibility.
 */

// Primary font - Ezra Bold for headlines and display
export const fontFamily = {
  bold: 'Ezra-Bold',
  regular: 'System',
  medium: 'System',
  black: 'Ezra-Bold',
};

// Secondary font - System font for body text and UI
export const fontFamilySecondary = {
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
};

// Font sizes (legacy - prefer typography tokens from tokens.js)
export const fontSize = {
  xs: 12,      // button text, uppercase labels
  sm: 14,      // captions, small labels
  base: 16,    // body text, inputs
  lg: 28,      // titles, headings
  xl: 40,      // display, hero text
};

export default {
  fontFamily,
  fontFamilySecondary,
  fontSize,
};
