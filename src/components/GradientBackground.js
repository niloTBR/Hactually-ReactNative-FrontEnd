/**
 * GradientBackground - solid base with two soft corner blooms.
 * Coral top-right, indigo bottom-left. Web uses CSS filter blur,
 * native falls back to expo-blur BlurView.
 */
import React, { memo } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { color } from '../theme';

const { width, height } = Dimensions.get('window');
const ORB_SIZE = Math.min(width, height) * 0.55;
const BLUR_PX = 90;
const IS_WEB = Platform.OS === 'web';
const BLUR_STYLE = IS_WEB ? { filter: `blur(${BLUR_PX}px)` } : null;

const orbBase = {
  position: 'absolute',
  width: ORB_SIZE,
  height: ORB_SIZE,
  borderRadius: ORB_SIZE / 2,
  opacity: 0.65,
};

const coralOrb = [
  orbBase,
  BLUR_STYLE,
  { backgroundColor: color.orange.dark, top: -ORB_SIZE * 0.25, right: -ORB_SIZE * 0.25 },
];

const indigoOrb = [
  orbBase,
  BLUR_STYLE,
  { backgroundColor: color.blue.dark, bottom: -ORB_SIZE * 0.25, left: -ORB_SIZE * 0.25 },
];

function GradientBackground({ children, base = color.charcoal, style }) {
  return (
    <View style={[styles.fill, { backgroundColor: base }, style]}>
      <View pointerEvents="none" style={coralOrb} />
      <View pointerEvents="none" style={indigoOrb} />
      {!IS_WEB && (
        <BlurView pointerEvents="none" intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
      )}
      {children}
    </View>
  );
}

export default memo(GradientBackground);

const styles = StyleSheet.create({
  fill: { flex: 1, overflow: 'hidden' },
});
