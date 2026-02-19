/**
 * Hactually Button Component
 * Three button styles: glass, solid (with shimmer), outline
 */
import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors, borderRadius, fontSize, shadows, fontFamily } from '../theme';

/**
 * Button variants:
 * - 'glass': Semi-transparent with blur (e.g., Continue with Apple/Google)
 * - 'solid': Solid color with shimmer animation (e.g., Start Spotting)
 * - 'outline': Simple border outline (e.g., Continue on profile setup)
 */
const Button = ({
  children,
  onPress,
  variant = 'solid', // 'solid' | 'outline' | 'glass'
  color = 'blue', // 'blue' | 'orange' | 'brown' | 'green'
  size = 'md', // 'sm' | 'md' | 'lg'
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  uppercase = false,
}) => {
  const colorScheme = colors[color] || colors.blue;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  // Shimmer animation for solid buttons
  useEffect(() => {
    if (variant === 'solid' && !disabled) {
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [variant, disabled]);

  const sizeStyles = {
    sm: { height: 36, paddingHorizontal: 12 },
    md: { height: 48, paddingHorizontal: 20 },
    lg: { height: 56, paddingHorizontal: 24 },
  };

  const textSizes = {
    sm: fontSize.xs,
    md: fontSize.sm,
    lg: fontSize.base,
  };

  const getTextColor = () => {
    if (disabled) return colors.brown.default;
    if (variant === 'solid') return colors.white;
    if (variant === 'glass') return colors.blue.light;
    if (variant === 'outline') return colorScheme.default;
    return colorScheme.default;
  };

  const buttonContent = (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text
            style={[
              styles.text,
              { color: getTextColor(), fontSize: textSizes[size] },
              uppercase && styles.uppercase,
              textStyle,
            ]}
          >
            {children}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </>
      )}
    </View>
  );

  // Glass style button (semi-transparent with blur)
  if (variant === 'glass') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[
          styles.button,
          styles.glassButton,
          sizeStyles[size],
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          style,
        ]}
      >
        {Platform.OS === 'ios' ? (
          <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="light" />
        ) : null}
        {buttonContent}
      </TouchableOpacity>
    );
  }

  // Outline style button
  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[
          styles.button,
          styles.outlineButton,
          sizeStyles[size],
          { borderColor: colorScheme.default },
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          style,
        ]}
      >
        {buttonContent}
      </TouchableOpacity>
    );
  }

  // Solid style button with shimmer
  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        sizeStyles[size],
        { backgroundColor: colorScheme.default },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        shadows.sm,
        style,
      ]}
    >
      <View style={styles.shimmerContainer}>
        <Animated.View
          style={[
            styles.shimmer,
            { transform: [{ translateX: shimmerTranslate }] },
          ]}
        />
      </View>
      {buttonContent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glassButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  text: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    textAlign: 'center',
  },
  uppercase: {
    textTransform: 'uppercase',
    letterSpacing: 3,
    fontSize: 11,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  shimmerContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  shimmer: {
    width: 100,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ skewX: '-20deg' }],
  },
});

export default Button;
