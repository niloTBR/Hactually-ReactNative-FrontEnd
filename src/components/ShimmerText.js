/**
 * Hactually ShimmerText Component
 * Animated text with shimmer/shine effect
 *
 * Usage:
 * <ShimmerText style={{ fontSize: 40 }}>hactually</ShimmerText>
 */
import React from 'react';
import { Text, StyleSheet, Platform } from 'react-native';
import { color, typography } from '../theme';

const ShimmerText = ({
  children,
  color: textColor = color.orange.dark,
  shimmerColor = 'rgba(255, 255, 255, 0.8)',
  duration = 2000,
  style,
}) => {
  // Web implementation using native span for proper CSS support
  if (Platform.OS === 'web') {
    const fontSize = style?.fontSize || typography.h1.fontSize;
    const fontFamily = style?.fontFamily || typography.h1.fontFamily;
    const lineHeight = style?.lineHeight || typography.h1.lineHeight;

    return (
      <>
        <style>{`
          @keyframes shimmer {
            0% { background-position: 150% 0; }
            100% { background-position: -50% 0; }
          }
        `}</style>
        <span
          style={{
            background: `linear-gradient(90deg, ${textColor} 0%, ${textColor} 35%, ${shimmerColor} 50%, ${textColor} 65%, ${textColor} 100%)`,
            backgroundSize: '250% 100%',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: `shimmer ${duration}ms linear infinite`,
            fontSize,
            fontFamily,
            lineHeight: `${lineHeight}px`,
            fontWeight: '700',
          }}
        >
          {children}
        </span>
      </>
    );
  }

  // Native: fallback to static text (MaskedView can be added later if needed)
  return (
    <Text style={[styles.text, style, { color: textColor }]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    ...typography.h1,
  },
});

export default ShimmerText;
