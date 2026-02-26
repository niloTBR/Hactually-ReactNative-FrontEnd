/**
 * Hactually Input Component
 * Text input with icon support and validation states
 */
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors, borderRadius, spacing, shadows, typography } from '../theme';

const Input = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  leftIcon,
  rightIcon,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete,
  maxLength,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  style,
  inputStyle,
  containerStyle,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const getBorderColor = () => {
    if (error) return colors.orange.default;
    if (isFocused) return colors.blue.default;
    return colors.brown.light + '4D'; // 30% opacity
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          multiline && styles.inputWrapperMultiline,
          {
            borderColor: getBorderColor(),
            backgroundColor: colors.white,
          },
          multiline && { height: 'auto', minHeight: 48 * numberOfLines },
          style,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.brown.default + '80'}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.input,
            leftIcon && { paddingLeft: 0 },
            (rightIcon || secureTextEntry) && { paddingRight: 0 },
            multiline && styles.multilineInput,
            !editable && styles.disabledInput,
            inputStyle,
          ]}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.rightIcon}
          >
            {showPassword ? (
              <EyeOff size={18} color={colors.brown.default} />
            ) : (
              <Eye size={18} color={colors.brown.default} />
            )}
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    ...typography.caption,
    fontWeight: '500',
    color: colors.brown.dark,
    marginBottom: spacing.sm, // 8px
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.lg, // 16px
    ...shadows.card,
  },
  inputWrapperMultiline: {
    borderRadius: borderRadius.xl,
    alignItems: 'flex-start',
    paddingVertical: spacing.md, // 12px
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.brown.dark,
    height: '100%',
    paddingVertical: spacing.md, // 12px
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: spacing.md, // 12px
  },
  disabledInput: {
    color: colors.brown.default,
    backgroundColor: colors.brown.lighter,
  },
  leftIcon: {
    marginRight: spacing.md, // 12px
  },
  rightIcon: {
    marginLeft: spacing.md, // 12px
    padding: spacing.xs, // 4px
  },
  error: {
    ...typography.caption,
    color: colors.orange.default,
    marginTop: spacing.xs, // 4px
    marginLeft: spacing.sm, // 8px
  },
});

export default Input;
