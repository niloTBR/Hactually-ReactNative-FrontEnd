/**
 * Hactually Badge Component
 * Small status/label indicators in 4 color variants
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, fontSize, spacing } from '../theme';

const Badge = ({
  children,
  variant = 'solid', // 'solid' | 'outline' | 'subtle'
  color = 'blue', // 'blue' | 'orange' | 'brown' | 'green'
  size = 'sm', // 'xs' | 'sm' | 'md'
  icon,
  style,
  textStyle,
}) => {
  const colorScheme = colors[color] || colors.blue;

  const getBackgroundColor = () => {
    if (variant === 'solid') return colorScheme.default;
    if (variant === 'subtle') return colorScheme.light;
    return 'transparent';
  };

  const getBorderColor = () => {
    if (variant === 'outline') return colorScheme.default;
    return 'transparent';
  };

  const getTextColor = () => {
    if (variant === 'solid') return colors.white;
    return colorScheme.default;
  };

  const sizeStyles = {
    xs: { paddingVertical: 2, paddingHorizontal: 6 },
    sm: { paddingVertical: 4, paddingHorizontal: 10 },
    md: { paddingVertical: 6, paddingHorizontal: 14 },
  };

  const textSizes = {
    xs: 10,
    sm: fontSize.xs,
    md: fontSize.sm,
  };

  return (
    <View
      style={[
        styles.badge,
        sizeStyles[size],
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
        },
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        style={[
          styles.text,
          { color: getTextColor(), fontSize: textSizes[size] },
          textStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: spacing[1],
  },
  text: {
    fontWeight: '600',
  },
});

export default Badge;
