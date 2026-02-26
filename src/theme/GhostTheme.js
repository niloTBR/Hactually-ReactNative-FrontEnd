/**
 * Ghost Theme Context
 * Provides automatic theming for ghost variant components
 *
 * Usage:
 * <GhostTheme themeColor={color.green.light} isDark>
 *   <Input variant="ghost" />  // Auto uses green.light placeholder, beige text
 *   <DatePicker variant="ghost" />
 *   <Chip variant="ghost" />
 * </GhostTheme>
 *
 * Components can still override with explicit themeColor prop
 */
import React, { createContext, useContext } from 'react';
import { View } from 'react-native';
import { color } from './tokens';

// Default ghost theme
const defaultTheme = { themeColor: color.green.light, isDark: true };

const GhostThemeContext = createContext(defaultTheme);

/**
 * Hook to get the current ghost theme
 * Returns { themeColor, isDark }
 */
export const useGhostTheme = () => useContext(GhostThemeContext);

/**
 * GhostTheme Provider
 * Wrap sections with this to set the ghost color for all children
 *
 * @param {string} themeColor - The color for ghost variant components (placeholder/borders)
 * @param {boolean} isDark - Whether the background is dark (determines text color)
 * @param {object} style - Optional container style
 * @param {ReactNode} children - Child components
 */
export const GhostTheme = ({ themeColor, isDark = false, style, children }) => (
  <GhostThemeContext.Provider value={{ themeColor, isDark }}>
    <View style={style}>
      {children}
    </View>
  </GhostThemeContext.Provider>
);

/**
 * Preset theme wrappers for common backgrounds
 * These combine the background color with the appropriate ghost theme
 */
export const DarkGreenTheme = ({ style, children }) => (
  <GhostTheme themeColor={color.green.light} isDark style={[{ backgroundColor: color.green.dark }, style]}>
    {children}
  </GhostTheme>
);

export const DarkBlueTheme = ({ style, children }) => (
  <GhostTheme themeColor={color.blue.light} isDark style={[{ backgroundColor: color.blue.dark }, style]}>
    {children}
  </GhostTheme>
);

export const DarkOrangeTheme = ({ style, children }) => (
  <GhostTheme themeColor={color.orange.light} isDark style={[{ backgroundColor: color.orange.dark }, style]}>
    {children}
  </GhostTheme>
);

export const DarkBrownTheme = ({ style, children }) => (
  <GhostTheme themeColor={color.brown.light} isDark style={[{ backgroundColor: color.brown.dark }, style]}>
    {children}
  </GhostTheme>
);

export default GhostTheme;
