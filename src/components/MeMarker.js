/**
 * MeMarker - Pulsing blue dot representing the user's location
 * Converted from Hactually 2.0 React app: 3 staggered ripple-fade rings
 * @keyframes ripple-fade { 0% { scale(0.3); opacity: 0.8 } 100% { scale(1.8); opacity: 0 } }
 */
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { color } from '../theme';

function RippleRing({ size, delay }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
        delay,
      }).start(() => startAnimation());
    };
    startAnimation();
  }, []);

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1.8],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 0],
  });

  return (
    <Animated.View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color.blue.dark,
          transform: [{ scale }],
          opacity,
        },
      ]}
    />
  );
}

export default function MeMarker({ size = 32 }) {
  return (
    <View style={[styles.container, { width: size * 2, height: size * 2 }]}>
      {/* 3 staggered ripple rings — exact match to React app */}
      <RippleRing size={size} delay={0} />
      <RippleRing size={size} delay={660} />
      <RippleRing size={size} delay={1330} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
  },
});
