/**
 * Hactually Button Component
 *
 * Variants:
 * - solid: Solid color with shimmer animation
 * - outline: Simple border outline
 * - ghost: Transparent with subtle border (for dark backgrounds)
 * - outline-gradient: Animated two-color gradient border
 * - glass: Semi-transparent with blur
 * - checkin: Slide-to-confirm button with gradient border
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors, gradients, radius, shadows, typography } from '../theme';

// ============================================================================
// ANIMATED GRADIENT COMPONENT
// Two-color conic gradient with smooth blending for border animation
// ============================================================================
const AnimatedGradientFill = ({ colorPair }) => {
  const [color1, color2] = colorPair;

  if (Platform.OS === 'web') {
    // Web: CSS conic-gradient for smooth color wheel effect
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          { background: `conic-gradient(from 0deg at 50% 50%, ${color1}, ${color2}, ${color1})` },
        ]}
      />
    );
  }

  // Native: LinearGradient fallback
  return (
    <LinearGradient
      colors={[color1, color2, color1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
  );
};

// ============================================================================
// BUTTON COMPONENT
// ============================================================================
const Button = ({
  children,
  onPress,
  variant = 'solid',
  color = 'blue',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  caption,
  fillColor,
  themeColor, // For ghost variant on dark backgrounds
  style,
  textStyle,
}) => {
  const colorScheme = colors[color] || colors.blue;

  // Animation values
  const shimmerX = useSharedValue(0);
  const rotation = useSharedValue(0);

  // Shimmer animation for solid buttons
  useEffect(() => {
    if (variant === 'solid' && !disabled) {
      shimmerX.value = 0;
      shimmerX.value = withRepeat(
        withTiming(100, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        false
      );
    }
  }, [variant, disabled]);

  // Rotation animation for gradient border buttons
  useEffect(() => {
    if ((variant === 'outline-gradient' || variant === 'checkin') && !disabled) {
      rotation.value = 0;
      rotation.value = withRepeat(
        withTiming(360, { duration: 3000, easing: Easing.linear }),
        -1,
        false
      );
    }
  }, [variant, disabled]);

  const shimmerStyle = useAnimatedStyle(() => ({
    left: `${shimmerX.value * 2 - 50}%`,
    transform: [{ skewX: '-20deg' }],
  }));

  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // Size configurations
  const sizeConfig = {
    sm: { height: 36, paddingHorizontal: 12 },
    md: { height: 48, paddingHorizontal: 20 },
    lg: { height: 56, paddingHorizontal: 24 },
  };

  const getTextColor = () => {
    if (disabled) return colors.olive.default;
    if (variant === 'solid') return colors.white;
    if (variant === 'glass') return colors.blue.light;
    if (variant === 'ghost') return themeColor || colorScheme.default;
    if (variant === 'outline') return colorScheme.default;
    return colorScheme.default;
  };

  // Shared button content
  const buttonContent = (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
            {children}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </>
      )}
    </View>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // VARIANT: Glass
  // ══════════════════════════════════════════════════════════════════════════
  if (variant === 'glass') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[
          styles.button,
          styles.glassButton,
          sizeConfig[size],
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          style,
        ]}
      >
        {Platform.OS === 'ios' && (
          <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="light" />
        )}
        {buttonContent}
      </TouchableOpacity>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // VARIANT: Outline
  // ══════════════════════════════════════════════════════════════════════════
  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[
          styles.button,
          styles.outlineButton,
          sizeConfig[size],
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

  // ══════════════════════════════════════════════════════════════════════════
  // VARIANT: Ghost
  // Transparent with subtle border, for dark backgrounds
  // ══════════════════════════════════════════════════════════════════════════
  if (variant === 'ghost') {
    const ghostColor = themeColor || colorScheme.default;
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[
          styles.button,
          styles.ghostButton,
          sizeConfig[size],
          { borderColor: ghostColor + '60' },
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={ghostColor} size="small" />
        ) : (
          <View style={styles.content}>
            {leftIcon && (
              <View style={styles.iconLeft}>
                {React.cloneElement(leftIcon, { color: ghostColor })}
              </View>
            )}
            <Text style={[styles.ghostText, { color: ghostColor }, textStyle]}>
              {children}
            </Text>
            {rightIcon && (
              <View style={styles.iconRight}>
                {React.cloneElement(rightIcon, { color: ghostColor })}
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // VARIANT: Outline Gradient
  // Animated two-color gradient border (blue/orange)
  // ══════════════════════════════════════════════════════════════════════════
  if (variant === 'outline-gradient') {
    const borderWidth = 2;
    const btnHeight = sizeConfig[size].height;
    const isDark = color === 'dark';
    const innerBg = fillColor || (isDark ? colors.olive.dark : colors.olive.lighter);
    const txtColor = isDark ? colors.white : colors.olive.dark;
    const borderColors = isDark ? gradients.borderDark : gradients.borderLight;

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[
          {
            height: btnHeight,
            paddingHorizontal: sizeConfig[size].paddingHorizontal + borderWidth,
            borderRadius: radius.full,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
          },
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          style,
        ]}
      >
        {/* Rotating gradient background */}
        <Animated.View style={[styles.gradientRotator, rotationStyle]}>
          <AnimatedGradientFill colorPair={borderColors} />
        </Animated.View>

        {/* Inner fill (creates border effect by covering center) */}
        <View
          style={[
            styles.gradientInner,
            {
              top: borderWidth,
              left: borderWidth,
              right: borderWidth,
              bottom: borderWidth,
              backgroundColor: innerBg,
            },
          ]}
        />

        <Text style={[styles.text, { color: txtColor, zIndex: 2 }, textStyle]}>
          {children}
        </Text>
      </TouchableOpacity>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // VARIANT: Check-in (Slide to confirm)
  // ══════════════════════════════════════════════════════════════════════════
  if (variant === 'checkin') {
    const borderWidth = 2;
    const btnHeight = sizeConfig[size].height;
    const defaultWidth = 320;
    const isDark = color === 'dark';
    const innerBg = isDark ? colors.olive.dark : colors.olive.light;
    const txtColor = isDark ? colors.white : colors.olive.dark;
    const circleSize = btnHeight - borderWidth * 2 - 6;
    const borderColors = isDark ? gradients.borderDark : gradients.borderLight;

    const [dragX, setDragX] = useState(0);
    const [containerWidth, setContainerWidth] = useState(defaultWidth);
    const dragRef = useRef({ isDragging: false, startX: 0, currentDragX: 0 });
    const maxDrag = containerWidth - circleSize - borderWidth * 2 - 8;

    const handleLayout = (e) => {
      const { width } = e.nativeEvent.layout;
      if (width > 0) setContainerWidth(width);
    };

    useEffect(() => {
      const handleMouseMove = (e) => {
        if (!dragRef.current.isDragging) return;
        const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
        const newX = Math.max(0, Math.min(clientX - dragRef.current.startX, maxDrag));
        dragRef.current.currentDragX = newX;
        setDragX(newX);
      };

      const handleMouseUp = () => {
        if (!dragRef.current.isDragging) return;
        dragRef.current.isDragging = false;
        if (dragRef.current.currentDragX > maxDrag * 0.7) {
          setDragX(maxDrag);
          onPress && onPress();
          setTimeout(() => setDragX(0), 300);
        } else {
          setDragX(0);
        }
        dragRef.current.currentDragX = 0;
      };

      if (Platform.OS === 'web') {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchmove', handleMouseMove);
        window.addEventListener('touchend', handleMouseUp);
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
          window.removeEventListener('touchmove', handleMouseMove);
          window.removeEventListener('touchend', handleMouseUp);
        };
      }
    }, [maxDrag, onPress]);

    const handleMouseDown = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      dragRef.current.isDragging = true;
      dragRef.current.startX = clientX - dragX;
    };

    const fillWidth = dragX + circleSize + 4;
    const fillColor = isDark ? 'rgba(212, 228, 165, 0.4)' : 'rgba(224, 90, 61, 0.3)';
    const circleColor = isDark ? colors.green.light : colors.orange.default;
    const arrowColor = isDark ? colors.olive.dark : colors.white;

    return (
      <View
        onLayout={handleLayout}
        style={[
          { height: btnHeight, borderRadius: radius.full, overflow: 'hidden' },
          fullWidth ? { width: '100%' } : { width: defaultWidth },
          disabled && styles.disabled,
          style,
        ]}
      >
        {/* Rotating gradient background */}
        <Animated.View style={[styles.gradientRotator, rotationStyle]}>
          <AnimatedGradientFill colorPair={borderColors} />
        </Animated.View>

        {/* Inner content area */}
        <View
          style={[
            styles.checkinInner,
            {
              top: borderWidth,
              left: borderWidth,
              right: borderWidth,
              bottom: borderWidth,
              backgroundColor: innerBg,
            },
          ]}
        >
          {/* Progress fill */}
          <View style={[styles.checkinFill, { width: fillWidth, backgroundColor: fillColor }]} />

          {/* Draggable circle and text */}
          <View style={styles.checkinContent}>
            <View
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              style={[
                styles.checkinCircle,
                {
                  width: circleSize,
                  height: circleSize,
                  borderRadius: circleSize / 2,
                  transform: [{ translateX: dragX }],
                  backgroundColor: circleColor,
                },
              ]}
            >
              <Text style={[styles.checkinArrow, { color: arrowColor }]}>→</Text>
            </View>

            <Text
              style={[
                styles.text,
                { color: txtColor, marginLeft: 12, position: 'absolute', left: circleSize + 8 },
                textStyle,
              ]}
            >
              {children}
            </Text>

            {caption && (
              <Text style={[styles.caption, { color: txtColor, position: 'absolute', right: 16 }]}>
                {caption}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // VARIANT: Solid (Default)
  // Solid color with shimmer animation
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        sizeConfig[size],
        { backgroundColor: colorScheme.default },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        shadows.sm,
        style,
      ]}
    >
      <View style={styles.shimmerContainer}>
        <Animated.View style={[styles.shimmer, shimmerStyle]}>
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.25)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0.25)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
      {buttonContent}
    </TouchableOpacity>
  );
};

// ============================================================================
// STYLES
// ============================================================================
const styles = StyleSheet.create({
  // Base button
  button: {
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  // Variant: Glass
  glassButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },

  // Variant: Outline
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },

  // Variant: Ghost
  ghostButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  ghostText: {
    ...typography.caption,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },

  // Modifiers
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },

  // Content
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  text: {
    ...typography.button,
    textAlign: 'center',
    marginTop: 2, // Push down for optical vertical centering
  },
  caption: {
    ...typography.caption,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },

  // Shimmer effect
  shimmerContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  shimmer: {
    width: '50%',
    height: '100%',
    position: 'absolute',
  },

  // Gradient border (large square that rotates)
  gradientRotator: {
    position: 'absolute',
    width: 600,
    height: 600,
    left: '50%',
    top: '50%',
    marginLeft: -300,
    marginTop: -300,
    zIndex: 0,
  },
  gradientInner: {
    position: 'absolute',
    borderRadius: radius.full,
    zIndex: 1,
  },

  // Check-in button
  checkinInner: {
    position: 'absolute',
    borderRadius: radius.full,
  },
  checkinFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: radius.full,
  },
  checkinContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  checkinCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    zIndex: 10,
    userSelect: 'none',
  },
  checkinArrow: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Button;
