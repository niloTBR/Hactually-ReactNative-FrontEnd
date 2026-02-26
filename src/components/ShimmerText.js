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
          .shimmer-text {
            background: linear-gradient(90deg, ${textColor} 0%, ${textColor} 40%, ${shimmerColor} 50%, ${textColor} 60%, ${textColor} 100%);
            background-size: 250% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer ${duration}ms linear infinite;
          }
        `}</style>
        <span
          className="shimmer-text"
          style={{
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
