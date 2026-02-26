/**
 * Hactually 2.0 Color System
 * 4 Core Colors: Blue, Orange, Brown, Green
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
  brown: {
    lighter: '#F5F1E8',
    mid: '#EDE5D5',
    light: '#C5C6AD',
    default: '#8A8B73',
    dark: '#6A6B5A',
  },

  // Accent - Green (NO teal - only lime and dark green)
  green: {
    light: '#D4E4A5',
    default: '#3A6262', // dark green (was teal #4A7C7C - removed)
    dark: '#3A6262',
  },

  // Error - Red (distinct from orange)
  red: {
    light: '#FF6B6B',
    default: '#D9081E',
  },

  // Base colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// Gradient definitions for LinearGradient component
export const gradients = {
  blue: ['#C8E3F4', '#5865F2'],
  orange: ['#F5C4C4', '#E05A3D'],
  brown: ['#E5D9C3', '#8A8B73'],
  green: ['#D4E4A5', '#3A6262'],
  // Animated border gradients (all 4 brand colors, looped)
  borderLight: ['#F5C4C4', '#C8E3F4', '#D4E4A5', '#C5C6AD', '#F5C4C4'], // light variants
  borderDark: ['#E05A3D', '#5865F2', '#3A6262', '#8A8B73', '#E05A3D'], // dark/default variants
};

export default colors;
