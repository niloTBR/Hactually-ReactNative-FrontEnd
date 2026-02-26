/**
 * Hactually Chip Component
 * Used for tags, interests, and filters
 * Supports solid (light bg) and ghost (dark bg) variants
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { color, colors, radius, spacing, typography, useGhostTheme } from '../theme';

const Chip = ({
  label,
  emoji,
  selected = false,
  onPress,
  onRemove,
  disabled = false,
  variant = 'solid', // 'solid' | 'ghost'
  themeColor, // For ghost variant - auto-detected from context if not provided
  size = 'md', // 'sm' | 'md'
}) => {
  const isGhost = variant === 'ghost';
  const showRemove = selected && onRemove;

  // Use context theme if themeColor not explicitly provided
  const ghostTheme = useGhostTheme();
  const resolvedThemeColor = themeColor || ghostTheme.themeColor;
  const isDarkBg = ghostTheme.isDark;

  // For selected ghost chips: dark bg = light theme = need dark text, light bg = dark theme = need light text
  const selectedTextColor = isDarkBg ? color.charcoal : color.beige;

  const getStyles = () => {
    if (isGhost) {
      if (selected) {
        return {
          backgroundColor: resolvedThemeColor,
          borderColor: resolvedThemeColor,
          textColor: selectedTextColor,
          emojiColor: selectedTextColor,
        };
      }
      return {
        backgroundColor: 'transparent',
        borderColor: resolvedThemeColor + '80', // 50%
        textColor: resolvedThemeColor, // 100%
        emojiColor: resolvedThemeColor,
      };
    }

    // Solid variant
    if (selected) {
      return {
        backgroundColor: colors.blue.default,
        borderColor: colors.blue.default,
        textColor: colors.white,
        emojiColor: colors.white,
      };
    }
    return {
      backgroundColor: colors.white,
      borderColor: colors.olive.light + '4D',
      textColor: colors.olive.dark,
      emojiColor: colors.olive.dark,
    };
  };

  const styles = getStyles();
  const sizeStyles = size === 'sm' ? chipStyles.chipSm : chipStyles.chipMd;

  const ChipContent = (
    <>
      {emoji && <Text style={[chipStyles.emoji, { color: styles.emojiColor }]}>{emoji}</Text>}
      <Text style={[chipStyles.label, { color: styles.textColor }]}>{label}</Text>
      {showRemove && (
        <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <X size={12} color={styles.textColor} />
        </TouchableOpacity>
      )}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        style={[
          chipStyles.chip,
          sizeStyles,
          {
            backgroundColor: styles.backgroundColor,
            borderColor: styles.borderColor,
          },
          disabled && chipStyles.disabled,
        ]}
      >
        {ChipContent}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        chipStyles.chip,
        sizeStyles,
        {
          backgroundColor: styles.backgroundColor,
          borderColor: styles.borderColor,
        },
        disabled && chipStyles.disabled,
      ]}
    >
      {ChipContent}
    </View>
  );
};

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: 1,
    gap: 6,
  },
  chipSm: {
    height: 28,
    paddingHorizontal: spacing.md,
  },
  chipMd: {
    height: 32,
    paddingHorizontal: spacing.md,
  },
  emoji: {
    fontSize: 14,
  },
  label: {
    ...typography.caption,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Chip;
