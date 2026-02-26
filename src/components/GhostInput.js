/**
 * Hactually Ghost Input Component
 * Transparent input with icon and action button for dark backgrounds
 */
import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { color, spacing, radius, typography, inputStyles, useGhostTheme } from '../theme';

const GhostInput = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Enter text',
  leftIcon,
  loading = false,
  disabled = false,
  themeColor, // Color for text/icons/border - auto-detected from context if not provided
  keyboardType = 'default',
  autoCapitalize = 'none',
  style,
}) => {
  // Use context theme if themeColor not explicitly provided
  const ghostTheme = useGhostTheme();
  const resolvedThemeColor = themeColor || ghostTheme.themeColor;
  const isDarkBg = ghostTheme.isDark;
  const canSubmit = value?.trim() && !loading && !disabled;
  const hasValue = value?.trim();

  // Contrast color for solid button: charcoal on light bg, beige on dark bg
  const buttonIconColor = isDarkBg ? color.charcoal : color.beige;

  return (
    <View
      style={[
        styles.container,
        { borderColor: hasValue ? resolvedThemeColor : resolvedThemeColor + '80' },
        disabled && styles.disabled,
        style,
      ]}
    >
      {leftIcon && (
        <View style={styles.iconLeft}>
          {React.cloneElement(leftIcon, { color: resolvedThemeColor, size: 16 })}
        </View>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={resolvedThemeColor + 'BF'}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={!disabled}
        onSubmitEditing={onSubmit}
        style={[styles.input, { color: resolvedThemeColor }]}
      />
      <TouchableOpacity
        onPress={onSubmit}
        disabled={!canSubmit}
        style={[
          styles.submitBtn,
          {
            backgroundColor: canSubmit ? resolvedThemeColor : resolvedThemeColor + '30',
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={canSubmit ? buttonIconColor : resolvedThemeColor} />
        ) : (
          <ArrowRight size={16} color={canSubmit ? buttonIconColor : resolvedThemeColor} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    ...inputStyles.base,
    ...inputStyles.ghost,
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    gap: spacing.md,
  },
  disabled: {
    opacity: 0.5,
  },
  iconLeft: {
    marginRight: 0,
  },
  input: {
    flex: 1,
    ...typography.body,
    height: '100%',
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  submitBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GhostInput;
