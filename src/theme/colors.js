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

  // Secondary - Cream/Brown/Olive
  brown: {
    lighter: '#F5F1E8',
    mid: '#EDE5D5',
    light: '#E5D9C3',
    default: '#8A8B73',
    dark: '#6A6B5A',
  },

  // Accent - Green/Teal
  green: {
    light: '#D4E4A5',
    default: '#4A7C7C',
    dark: '#3A6262',
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
  green: ['#D4E4A5', '#4A7C7C'],
  shimmer: ['#D9081E', '#E05A3D', '#5865F2', '#D9081E'],
};

export default colors;
