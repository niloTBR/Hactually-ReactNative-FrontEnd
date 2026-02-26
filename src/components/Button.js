/**
 * Hactually Button Component
 * Three button styles: glass, solid (with shimmer), outline
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

// Create animated LinearGradient
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

/**
 * Button variants:
 * - 'glass': Semi-transparent with blur (e.g., Continue with Apple/Google)
 * - 'solid': Solid color with shimmer animation (e.g., Start Spotting)
 * - 'outline': Simple border outline (e.g., Continue on profile setup)
 */
const Button = ({
  children,
  onPress,
  variant = 'solid', // 'solid' | 'outline' | 'glass' | 'outline-gradient' | 'checkin'
  color = 'blue', // 'blue' | 'orange' | 'brown' | 'green' | 'transparent' | 'dark'
  size = 'md', // 'sm' | 'md' | 'lg'
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  caption,
  fillColor, // For outline-gradient: pass background color to match
  style,
  textStyle,
}) => {
  const colorScheme = colors[color] || colors.blue;

  // Reanimated shared values for smooth animations
  const shimmerX = useSharedValue(0);
  const rotation = useSharedValue(0);

  // Shimmer animation for solid buttons - percentage based (0 to 100)
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

  // Shimmer travels from -50% to 150% of button width
  const shimmerStyle = useAnimatedStyle(() => ({
    left: `${shimmerX.value * 2 - 50}%`,
    transform: [{ skewX: '-20deg' }],
  }));

  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const sizeStyles = {
    sm: { height: 36, paddingHorizontal: 12 },
    md: { height: 48, paddingHorizontal: 20 },
    lg: { height: 56, paddingHorizontal: 24 },
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
          <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
            {children}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </>
      )}
    </View>
  );

  // Glass style button
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
        {Platform.OS === 'ios' && (
          <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="light" />
        )}
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

  // Outline gradient style button (fillColor matches any background)
  if (variant === 'outline-gradient') {
    const bw = 2;
    const btnHeight = sizeStyles[size].height;
    const isDark = color === 'dark';
    // Inner background: use fillColor prop, or fallback to beige/dark defaults
    const innerBg = fillColor || (isDark ? colors.brown.dark : colors.brown.lighter);
    const txtColor = isDark ? colors.white : colors.brown.dark;

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[
          {
            height: btnHeight,
            paddingHorizontal: sizeStyles[size].paddingHorizontal + bw,
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
        <Animated.View style={[styles.gradientRotator, rotationStyle]}>
          <LinearGradient
            colors={isDark ? gradients.borderLight : gradients.borderDark}
            locations={[0, 0.25, 0.5, 0.75, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
        {/* Inner fill creates the border effect */}
        <View
          style={[
            styles.gradientInner,
            { top: bw, left: bw, right: bw, bottom: bw, backgroundColor: innerBg },
          ]}
        />
        <Text style={[styles.text, { color: txtColor, zIndex: 2 }, textStyle]}>
          {children}
        </Text>
      </TouchableOpacity>
    );
  }

  // Check-in style button
  if (variant === 'checkin') {
    const bw = 2;
    const btnHeight = sizeStyles[size].height;
    const btnWidth = 320;
    const isDarkCheckin = color === 'dark';
    // Light olive for light mode, dark for dark mode
    const innerBg = isDarkCheckin ? colors.brown.dark : colors.brown.light;
    const txtColor = isDarkCheckin ? colors.white : colors.brown.dark;
    const circleSize = btnHeight - bw * 2 - 6;
    const maxDrag = btnWidth - circleSize - bw * 2 - 8;

    const [dragX, setDragX] = useState(0);
    const dragRef = useRef({ isDragging: false, startX: 0, currentDragX: 0 });

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

    return (
      <View
        style={[
          { height: btnHeight, width: btnWidth, borderRadius: radius.full, overflow: 'hidden' },
          disabled && styles.disabled,
          style,
        ]}
      >
        <Animated.View style={[styles.checkinGradientRotator, rotationStyle]}>
          <LinearGradient
            colors={isDarkCheckin ? gradients.borderLight : gradients.borderDark}
            locations={[0, 0.25, 0.5, 0.75, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
        <View style={[styles.checkinInner, { top: bw, left: bw, right: bw, bottom: bw, backgroundColor: innerBg }]}>
          <View style={[styles.checkinFill, { width: fillWidth, backgroundColor: isDarkCheckin ? 'rgba(212, 228, 165, 0.4)' : 'rgba(224, 90, 61, 0.3)' }]} />
          <View style={styles.checkinContent}>
            <View
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              style={[styles.checkinCircle, { width: circleSize, height: circleSize, borderRadius: circleSize / 2, transform: [{ translateX: dragX }], backgroundColor: isDarkCheckin ? colors.green.light : colors.orange.default }]}
            >
              <Text style={[styles.checkinArrow, { color: isDarkCheckin ? colors.brown.dark : colors.white }]}>→</Text>
            </View>
            <Text style={[styles.text, { color: txtColor, marginLeft: 12, position: 'absolute', left: circleSize + 8 }, textStyle]}>
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

  // Solid style button with smooth shimmer (default)
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

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.full,
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
    ...typography.button,
    textAlign: 'center',
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
  // Shimmer styles
  shimmerContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  shimmer: {
    width: '50%',
    height: '100%',
    position: 'absolute',
  },
  // Gradient border styles - 600x600 to cover wide buttons
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
  // Checkin styles - 600x600 to cover wide buttons
  checkinGradientRotator: {
    position: 'absolute',
    width: 600,
    height: 600,
    left: '50%',
    top: '50%',
    marginLeft: -300,
    marginTop: -300,
  },
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
