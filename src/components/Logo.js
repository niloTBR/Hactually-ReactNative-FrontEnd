/**
 * Hactually Logo Component
 * SVG logo icon with optional text
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, fontFamily } from '../theme';

// Just the icon - using solid color for better web compatibility
export const LogoIcon = ({ size = 32 }) => {
  const width = size * 1.5;
  const height = size;

  return (
    <Svg width={width} height={height} viewBox="0 0 192 128" fill="none">
      <Path
        d="M96 64C96 99.3462 67.3462 128 32 128H0V0H96V64ZM192 128H96V64C96 28.6538 124.654 0 160 0H192V128Z"
        fill="#E05A3D"
      />
    </Svg>
  );
};

// Icon with text
export const LogoWithText = ({ size = 32, textColor = colors.blue.light }) => (
  <View style={styles.container}>
    <LogoIcon size={size} />
    <Text style={[styles.text, { color: textColor, fontSize: size * 0.75 }]}>
      hactually
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
  },
});

export default LogoIcon;
