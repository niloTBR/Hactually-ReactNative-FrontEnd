/**
 * Hactually OTP Input Component
 * 6-digit code input with auto-advance
 * Supports solid (light bg) and ghost (dark bg) variants
 */
import React, { useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, Keyboard, Platform } from 'react-native';
import { colors, color, radius, spacing, shadows, typography, useGhostTheme } from '../theme';

const OTPInput = ({
  value = ['', '', '', '', '', ''],
  onChange,
  onComplete,
  length = 6,
  disabled = false,
  error = false,
  autoFocus = true,
  variant = 'solid', // 'solid' | 'ghost'
  themeColor, // For ghost variant - auto-detected from context if not provided
}) => {
  const inputRefs = useRef([]);
  const isGhost = variant === 'ghost';

  // Use context theme if themeColor not explicitly provided
  const ghostTheme = useGhostTheme();
  const resolvedThemeColor = themeColor || ghostTheme.themeColor;

  useEffect(() => {
    if (autoFocus) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  const handleChange = (index, text) => {
    const digit = text.slice(-1);
    if (digit && !/^\d$/.test(digit)) return;

    const newValue = [...value];
    newValue[index] = digit;
    onChange(newValue);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (digit && index === length - 1 && newValue.every((d) => d)) {
      Keyboard.dismiss();
      onComplete?.(newValue.join(''));
    }
  };

  const handleKeyPress = (index, e) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const getInputStyle = (index) => {
    const isFilled = value[index];

    if (isGhost) {
      return {
        borderColor: error
          ? color.error.light
          : isFilled
          ? resolvedThemeColor  // 100% when filled
          : resolvedThemeColor + '80', // 50% when empty
        backgroundColor: 'transparent',
        color: resolvedThemeColor, // 100%
      };
    }

    return {
      borderColor: error
        ? color.error.dark
        : isFilled
        ? colors.blue.default
        : colors.brown.light + '80', // 50%
      backgroundColor: colors.white,
      color: colors.brown.dark,
    };
  };

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          value={value[index]}
          onChangeText={(text) => handleChange(index, text)}
          onKeyPress={(e) => handleKeyPress(index, e)}
          keyboardType={Platform.OS === 'web' ? 'default' : 'number-pad'}
          maxLength={1}
          editable={!disabled}
          selectTextOnFocus
          style={[
            styles.input,
            !isGhost && shadows.card,
            getInputStyle(index),
            disabled && styles.inputDisabled,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  input: {
    width: 48,
    height: 56,
    borderRadius: radius.lg, // 16px - less rounded
    borderWidth: 1,
    fontSize: typography.h2.fontSize,
    fontWeight: '700',
    textAlign: 'center',
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  inputDisabled: {
    opacity: 0.5,
  },
});

export default OTPInput;
