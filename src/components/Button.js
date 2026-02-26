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
  Animated,
  Easing,
  PanResponder,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors, borderRadius, shadows, typography } from '../theme';

/**
 * Button variants:
 * - 'glass': Semi-transparent with blur (e.g., Continue with Apple/Google)
 * - 'solid': Solid color with shimmer animation (e.g., Start Spotting)
 * - 'outline': Simple border outline (e.g., Continue on profile setup)
 */
const Button = ({
  children,
  onPress,
  variant = 'solid', // 'solid' | 'outline' | 'glass' | 'slide'
  color = 'blue', // 'blue' | 'orange' | 'brown' | 'green'
  size = 'md', // 'sm' | 'md' | 'lg'
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  caption, // Right-side caption text (e.g., "1 credit")
  style,
  textStyle,
  uppercase = false,
}) => {
  const colorScheme = colors[color] || colors.blue;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  // Animation for solid shimmer and gradient border
  useEffect(() => {
    if (variant === 'solid' && !disabled) {
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        })
      ).start();
    } else if ((variant === 'outline-gradient' || variant === 'checkin') && !disabled) {
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      ).start();
    }
  }, [variant, disabled]);

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
          <Text
            style={[
              styles.text,
              { color: getTextColor() },
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

  // Outline style button (simple border)
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

  // Outline gradient style button (animated rotating gradient border)
  if (variant === 'outline-gradient') {
    const bw = 2;
    const btnHeight = sizeStyles[size].height;
    const innerBg = color === 'dark' ? colors.brown.dark : colors.brown.mid;
    const textColor = color === 'dark' ? colors.white : colors.brown.dark;

    const rotation = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[
          {
            height: btnHeight,
            paddingHorizontal: sizeStyles[size].paddingHorizontal + bw,
            borderRadius: borderRadius.full,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
          },
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          style,
        ]}
      >
        {/* Rotating gradient background (acts as border) - smooth color wheel */}
        <Animated.View
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            transform: [{ rotate: rotation }],
          }}
        >
          {/* Top half: orange to blue */}
          <LinearGradient
            colors={[colors.orange.default, colors.blue.default]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
          {/* Bottom half: green to brown */}
          <LinearGradient
            colors={[colors.green.default, colors.brown.default]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
        {/* Inner background (creates border effect) */}
        <View
          style={{
            position: 'absolute',
            top: bw,
            left: bw,
            right: bw,
            bottom: bw,
            borderRadius: borderRadius.full,
            backgroundColor: innerBg,
          }}
        />
        {/* Text on top */}
        <Text style={[styles.text, { color: textColor }, textStyle]}>
          {children}
        </Text>
      </TouchableOpacity>
    );
  }

  // Check-in style button with rotating gradient border, draggable circle with fill effect
  if (variant === 'checkin') {
    const bw = 2;
    const btnHeight = sizeStyles[size].height;
    const btnWidth = 320;
    const innerBg = color === 'dark' ? colors.brown.dark : colors.brown.mid;
    const textColor = color === 'dark' ? colors.white : colors.brown.dark;
    const circleSize = btnHeight - bw * 2 - 6;
    const maxDrag = btnWidth - circleSize - bw * 2 - 8;

    const rotation = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    // Drag state
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

    // Fill width based on drag position
    const fillWidth = dragX + circleSize + 4;

    return (
      <View
        style={[
          {
            height: btnHeight,
            width: btnWidth,
            borderRadius: borderRadius.full,
            overflow: 'hidden',
          },
          disabled && styles.disabled,
          style,
        ]}
      >
        {/* Rotating gradient border */}
        <Animated.View
          style={{
            position: 'absolute',
            width: 400,
            height: 400,
            left: '50%',
            top: '50%',
            marginLeft: -200,
            marginTop: -200,
            transform: [{ rotate: rotation }],
          }}
        >
          <LinearGradient
            colors={[colors.orange.default, colors.blue.default]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
          <LinearGradient
            colors={[colors.green.default, colors.brown.default]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
        {/* Inner background */}
        <View
          style={{
            position: 'absolute',
            top: bw,
            left: bw,
            right: bw,
            bottom: bw,
            borderRadius: borderRadius.full,
            backgroundColor: innerBg,
          }}
        >
          {/* Fill effect as you drag */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: fillWidth,
              borderRadius: borderRadius.full,
              backgroundColor: colors.blue.default,
              opacity: 0.3,
            }}
          />
          {/* Content row */}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 3,
            }}
          >
            {/* Draggable circle with arrow */}
            <View
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              style={{
                width: circleSize,
                height: circleSize,
                borderRadius: circleSize / 2,
                backgroundColor: colors.orange.default,
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{ translateX: dragX }],
                cursor: 'grab',
                zIndex: 10,
                userSelect: 'none',
              }}
            >
              <Text style={{ color: colors.white, fontSize: 16, fontWeight: '600' }}>→</Text>
            </View>
            {/* Text label - left aligned */}
            <Text style={[styles.text, { color: textColor, marginLeft: 12, position: 'absolute', left: circleSize + 8 }, textStyle]}>
              {children}
            </Text>
            {/* Right: Caption */}
            {caption && (
              <Text style={[styles.caption, { color: textColor, position: 'absolute', right: 16 }]}>
                {caption}
              </Text>
            )}
          </View>
        </View>
      </View>
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
  outlineInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  gradientBtnWrapper: {
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  gradientBtnInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
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
