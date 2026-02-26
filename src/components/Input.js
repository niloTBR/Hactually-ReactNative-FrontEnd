/**
 * Hactually Input Component
 * Text input with icon support and validation states
 * Supports solid (light bg) and ghost (dark bg) variants
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
import { colors, color, radius, spacing, shadows, typography, useGhostTheme } from '../theme';

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
  variant = 'solid', // 'solid' | 'ghost'
  themeColor, // For ghost variant - auto-detected from context if not provided
  style,
  inputStyle,
  containerStyle,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState('');
  const isGhost = variant === 'ghost';

  // Use context theme if themeColor not explicitly provided
  const ghostTheme = useGhostTheme();
  const resolvedThemeColor = themeColor || ghostTheme.themeColor;
  const isDarkBg = ghostTheme.isDark;

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleChangeText = (text) => {
    setInternalValue(text);
    onChangeText?.(text);
  };

  // Check controlled value OR internal value for uncontrolled inputs
  const hasValue = (value !== undefined ? value : internalValue).length > 0;

  const getBorderColor = () => {
    if (error) return isGhost ? color.error.light : color.error.dark;
    // Full border (100%) when focused OR has value, otherwise 50% (80 hex)
    if (isFocused || hasValue) return isGhost ? resolvedThemeColor : colors.blue.default;
    return isGhost ? resolvedThemeColor + '80' : colors.brown.light + '80';
  };

  const getBackgroundColor = () => {
    // Ghost: 10% fill when focused (1A hex), transparent otherwise
    if (isGhost) return isFocused ? resolvedThemeColor + '1A' : 'transparent';
    return colors.white;
  };

  const getTextColor = () => {
    // Ghost: 100% theme color when typing
    return isGhost ? resolvedThemeColor : colors.brown.dark;
  };

  const getPlaceholderColor = () => {
    // Ghost: 75% opacity for placeholder (BF hex)
    return isGhost ? resolvedThemeColor + 'BF' : colors.brown.default + 'BF';
  };

  const getLabelColor = () => {
    // Labels: always 100% contrast color
    return isGhost ? resolvedThemeColor : colors.brown.dark;
  };

  const getIconColor = () => {
    return isGhost ? resolvedThemeColor : colors.brown.default;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: getLabelColor() }]}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          multiline && styles.inputWrapperMultiline,
          {
            borderColor: getBorderColor(),
            backgroundColor: getBackgroundColor(),
          },
          !isGhost && shadows.card,
          multiline && { height: 'auto', minHeight: 48 * numberOfLines },
          style,
        ]}
      >
        {leftIcon && (
          <View style={styles.leftIcon}>
            {React.cloneElement(leftIcon, { color: getIconColor(), size: leftIcon.props.size || 18 })}
          </View>
        )}

        <TextInput
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={getPlaceholderColor()}
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
            { color: getTextColor() },
            leftIcon && { paddingLeft: 0 },
            (rightIcon || secureTextEntry) && { paddingRight: 0 },
            multiline && styles.multilineInput,
            !editable && !isGhost && styles.disabledInput,
            !editable && { opacity: 0.5 },
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
              <EyeOff size={18} color={getIconColor()} />
            ) : (
              <Eye size={18} color={getIconColor()} />
            )}
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <View style={styles.rightIcon}>
            {React.cloneElement(rightIcon, { color: getIconColor(), size: rightIcon.props.size || 18 })}
          </View>
        )}
      </View>

      {error && (
        <Text style={[styles.error, isGhost && { color: color.error.light }]}>
          {error}
        </Text>
      )}
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
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
  },
  inputWrapperMultiline: {
    borderRadius: radius.lg,
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
  },
  input: {
    flex: 1,
    ...typography.body,
    height: '100%',
    paddingVertical: spacing.md,
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  disabledInput: {
    backgroundColor: colors.brown.lighter,
  },
  leftIcon: {
    marginRight: spacing.md,
  },
  rightIcon: {
    marginLeft: spacing.md,
    padding: spacing.xs,
  },
  error: {
    ...typography.caption,
    color: colors.red.default,
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
  },
});

export default Input;
