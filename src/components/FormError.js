/**
 * Hactually FormError Component
 * Consistent error message display for form fields
 */
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { color, spacing, typography, useGhostTheme } from '../theme';

const FormError = ({
  message,
  variant = 'solid', // 'solid' | 'ghost'
  style,
}) => {
  if (!message) return null;

  const isGhost = variant === 'ghost';
  const ghostTheme = useGhostTheme();
  const isDark = ghostTheme.isDark;

  // Ghost on dark bg uses light error color, otherwise dark
  const errorColor = isGhost && isDark ? color.error.light : color.error.dark;

  return (
    <Text style={[styles.error, { color: errorColor }, style]}>
      {message}
    </Text>
  );
};

const styles = StyleSheet.create({
  error: {
    ...typography.caption,
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
  },
});

export default FormError;
