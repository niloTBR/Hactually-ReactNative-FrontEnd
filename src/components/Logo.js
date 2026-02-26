/**
 * Hactually Logo Component
 * Fully tokenized with size and color variants
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { fontFamily } from '../theme';
import { logoPath, logoAspectRatio, logoSizes, logoColors } from '../theme/brand';

/**
 * Logo Mark (icon only)
 * @param {string} size - 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' or number
 * @param {string} color - Any valid color string
 * @param {string} colorScheme - 'light' | 'dark'
 * @param {string} colorVariant - 'orange' | 'blue' | 'olive' | 'green'
 */
export const LogoMark = ({
  size = 'md',
  color,
  colorScheme,
  colorVariant,
}) => {
  // Resolve size from tokens or use direct number
  const resolvedSize = typeof size === 'string' ? logoSizes[size] || logoSizes.md : size;
  const width = resolvedSize * logoAspectRatio;
  const height = resolvedSize;

  // Resolve color: direct color prop takes precedence, then scheme+variant, then default
  let resolvedColor = color;
  if (!resolvedColor && colorScheme && colorVariant) {
    resolvedColor = logoColors[colorScheme]?.[colorVariant];
  }
  if (!resolvedColor) {
    resolvedColor = logoColors.dark.orange; // default
  }

  return (
    <Svg width={width} height={height} viewBox="0 0 192 128" fill="none">
      <Path d={logoPath} fill={resolvedColor} />
    </Svg>
  );
};

/**
 * Logo with Text
 * @param {string} size - 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' or number
 * @param {string} color - Any valid color string (applies to both icon and text)
 * @param {string} colorScheme - 'light' | 'dark'
 * @param {string} colorVariant - 'orange' | 'blue' | 'olive' | 'green'
 */
export const LogoWithText = ({
  size = 'sm',
  color,
  colorScheme,
  colorVariant,
}) => {
  // Resolve size
  const resolvedSize = typeof size === 'string' ? logoSizes[size] || logoSizes.sm : size;

  // Resolve color
  let resolvedColor = color;
  if (!resolvedColor && colorScheme && colorVariant) {
    resolvedColor = logoColors[colorScheme]?.[colorVariant];
  }
  if (!resolvedColor) {
    resolvedColor = logoColors.dark.orange;
  }

  // Text size scales with logo size (1.5x larger)
  const textSize = Math.max(14, resolvedSize * 1.0);
  const gap = Math.max(6, resolvedSize * 0.25);
  const textOffset = Math.max(2, resolvedSize * 0.15); // Offset text lower

  // Icon size 1.5x
  const iconSize = resolvedSize * 1.5;

  return (
    <View style={[styles.container, { gap }]}>
      <LogoMark size={iconSize} color={resolvedColor} />
      <Text style={[styles.text, { color: resolvedColor, fontSize: textSize, marginTop: textOffset }]}>
        hactually
      </Text>
    </View>
  );
};

/**
 * App Icon (logo with background container)
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl' or number
 * @param {string} colorScheme - 'light' | 'dark'
 * @param {string} colorVariant - 'orange' | 'blue' | 'olive' | 'green'
 * @param {string} backgroundColor - Override background color
 * @param {string} foregroundColor - Override foreground/logo color
 */
export const AppIcon = ({
  size = 'md',
  colorScheme = 'light',
  colorVariant = 'orange',
  backgroundColor,
  foregroundColor,
  borderRadius,
}) => {
  // Import here to avoid circular dependency
  const { appIconVariants, appIconContainerSizes } = require('../theme/brand');

  // Resolve container size
  const containerConfig = typeof size === 'string'
    ? appIconContainerSizes[size] || appIconContainerSizes.md
    : { size, borderRadius: size * 0.25 };

  const containerSize = containerConfig.size;
  const resolvedBorderRadius = borderRadius ?? containerConfig.borderRadius;

  // Resolve colors from variants
  const variant = appIconVariants[colorScheme]?.[colorVariant] || appIconVariants.light.orange;
  const bgColor = backgroundColor || variant.bg;
  const fgColor = foregroundColor || variant.fg;

  // Logo size is ~40% of container
  const logoSize = containerSize * 0.4;

  return (
    <View style={[
      styles.appIconContainer,
      {
        width: containerSize,
        height: containerSize,
        borderRadius: resolvedBorderRadius,
        backgroundColor: bgColor,
      }
    ]}>
      <LogoMark size={logoSize} color={fgColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
  },
  appIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Default export
export default LogoMark;
