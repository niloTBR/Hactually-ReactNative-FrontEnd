/**
 * Hactually 2.0 Color System
 * 4 Core Colors: Blue, Orange, Olive, Green
 * Each with light, default, and dark variants
 */

export const colors = {
  // Primary - Blue
  blue: {
    light: '#C8E3F4',
    default: '#5865F2',
    dark: '#4752C4',
  },

  // Accent - Coral/Orange
  orange: {
    light: '#F5C4C4',
    default: '#E05A3D',
    dark: '#C94A2F',
  },

  // Secondary - Olive
  olive: {
    lighter: '#F5F1E8',
    mid: '#EDE5D5',
    light: '#C5C6AD',
    default: '#8A8B73',
    dark: '#6A6B5A',
  },

  // Accent - Green
  green: {
    light: '#D4E4A5',
    default: '#3A6262',
    dark: '#3A6262',
  },

  // Error - Red
  red: {
    light: '#FF6B6B',
    default: '#D9081E',
  },

  // Base colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

/**
 * Gradient definitions
 * Used by LinearGradient components and animated borders
 */
export const gradients = {
  // Single-color gradients (light to dark)
  blue: [colors.blue.light, colors.blue.default],
  orange: [colors.orange.light, colors.orange.default],
  olive: [colors.olive.light, colors.olive.default],
  green: [colors.green.light, colors.green.default],

  /**
   * Animated border gradients
   * Two-color gradients that rotate around button borders
   * - borderLight: For buttons on LIGHT backgrounds (vibrant colors for contrast)
   * - borderDark: For buttons on DARK backgrounds (pastel colors for contrast)
   */
  borderLight: [colors.blue.default, colors.orange.default],
  borderDark: ['#A8D4F0', '#FFB5A7'], // light blue, peach (softer than brand colors)
};

export default colors;
