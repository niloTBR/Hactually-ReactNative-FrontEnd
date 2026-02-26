/**
 * Hactually Badge Component
 * Small status/label indicators in 4 color variants
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

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
    xs: { paddingVertical: 2, paddingHorizontal: 6, fontSize: 10 },
    sm: { paddingVertical: 4, paddingHorizontal: 10, fontSize: 11 },
    md: { paddingVertical: 6, paddingHorizontal: 14, fontSize: 12 },
  };

  return (
    <View
      style={[
        styles.badge,
        {
          paddingVertical: sizeStyles[size].paddingVertical,
          paddingHorizontal: sizeStyles[size].paddingHorizontal,
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
          { color: getTextColor(), fontSize: sizeStyles[size].fontSize },
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
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: spacing.xs,
  },
  text: {
    fontWeight: '600',
  },
});

export default Badge;
