/**
 * Hactually OTP Input Component
 * 6-digit code input with auto-advance
 */
import React, { useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, Keyboard, Platform } from 'react-native';
import { colors, borderRadius, spacing, shadows, typography } from '../theme';

const OTPInput = ({
  value = ['', '', '', '', '', ''],
  onChange,
  onComplete,
  length = 6,
  disabled = false,
  error = false,
  autoFocus = true,
}) => {
  const inputRefs = useRef([]);

  useEffect(() => {
    if (autoFocus) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  const handleChange = (index, text) => {
    // Get last character (handles paste and regular input)
    const digit = text.slice(-1);

    // Only accept digits
    if (digit && !/^\d$/.test(digit)) return;

    const newValue = [...value];
    newValue[index] = digit;
    onChange(newValue);

    // Auto-advance to next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    if (digit && index === length - 1 && newValue.every((d) => d)) {
      Keyboard.dismiss();
      onComplete?.(newValue.join(''));
    }
  };

  const handleKeyPress = (index, e) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (text) => {
    const digits = text.replace(/\D/g, '').slice(0, length);
    if (digits.length === length) {
      const newValue = digits.split('');
      onChange(newValue);
      inputRefs.current[length - 1]?.focus();
      Keyboard.dismiss();
      onComplete?.(digits);
    }
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
            value[index] && styles.inputFilled,
            error && styles.inputError,
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
    justifyContent: 'flex-start',
    gap: spacing.sm, // 8px
  },
  input: {
    width: 48,
    height: 56,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.brown.light + '4D',
    backgroundColor: colors.white,
    fontSize: typography.h2.fontSize,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.brown.dark,
    ...shadows.card,
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  inputFilled: {
    borderColor: colors.blue.default,
  },
  inputError: {
    borderColor: colors.orange.default,
  },
  inputDisabled: {
    backgroundColor: colors.brown.lighter,
    opacity: 0.6,
  },
});

export default OTPInput;
