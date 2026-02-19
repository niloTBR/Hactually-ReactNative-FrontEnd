/**
 * Hactually OTP Input Component
 * 6-digit code input with auto-advance
 */
import React, { useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
import { colors, borderRadius, fontSize, spacing, shadows } from '../theme';

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
    // Only accept digits
    if (text && !/^\d$/.test(text)) return;

    const newValue = [...value];
    newValue[index] = text;
    onChange(newValue);

    // Auto-advance to next input
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    if (text && index === length - 1 && newValue.every((d) => d)) {
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
          keyboardType="number-pad"
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
    justifyContent: 'center',
    gap: spacing[2],
  },
  input: {
    width: 44,
    height: 52,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.brown.light + '4D',
    backgroundColor: colors.white,
    fontSize: fontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.black,
    ...shadows.card,
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
