/**
 * Hactually Social Button Component
 * Ghost-style buttons for Google/Apple sign-in
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { color, spacing, radius, typography, inputStyles } from '../theme';
import { GoogleIcon, AppleIcon } from './Icons';

const SocialButton = ({
  provider = 'google', // 'google' | 'apple'
  onPress,
  disabled = false,
  loading = false,
  themeColor = color.green.light, // Color for text/icons/border
  style,
}) => {
  const Icon = provider === 'google' ? GoogleIcon : AppleIcon;
  const label = provider === 'google' ? 'Google' : 'Apple';
  const iconSize = provider === 'google' ? 20 : 24;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        { borderColor: themeColor + '60' },
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={themeColor} />
      ) : (
        <>
          <Icon size={iconSize} color={themeColor} />
          <Text style={[styles.text, { color: themeColor }]}>
            <Text style={styles.textSmall}>continue with </Text>
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...inputStyles.base,
    ...inputStyles.ghost,
    gap: spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.body,
    fontWeight: '700',
  },
  textSmall: {
    ...typography.caption,
    fontWeight: '400',
  },
});

export default SocialButton;
