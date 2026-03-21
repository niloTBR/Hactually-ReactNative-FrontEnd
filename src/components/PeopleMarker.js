/**
 * PeopleMarker - Reusable avatar stack with spinning gradient count badge
 * Converted from Hactually 2.0 React app:
 * - Avatars: 36px, 2px white border, -20px overlap
 * - Badge: conic-gradient spinning 3s, 1px inset, same size as avatars
 * - Venue label: 10px bold, pill bg with blur
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { color, spacing, typography } from '../theme';

const DEFAULT_SIZE = 36;
const DEFAULT_OVERLAP = -20;
const BADGE_INSET = 1;

export default function PeopleMarker({
  people = [],
  count = 0,
  venueName,
  size = DEFAULT_SIZE,
  overlap = DEFAULT_OVERLAP,
}) {
  const visibleAvatars = people.slice(0, 2);
  const remaining = count > 0 ? count : Math.max(0, people.length - 2);
  const displayCount = remaining > 99 ? 99 : remaining;
  const innerSize = size - BADGE_INSET * 2;

  // Spinning animation for gradient border
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.avatarRow}>
        {visibleAvatars.map((person, i) => (
          <View
            key={i}
            style={[
              styles.avatarWrapper,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                marginLeft: i > 0 ? overlap : 0,
                zIndex: i + 1,
              },
            ]}
          >
            <Image source={{ uri: person.photo }} style={[styles.avatar, { borderRadius: size / 2 }]} />
          </View>
        ))}
        {remaining > 0 && (
          <View
            style={[
              styles.badgeOuter,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                marginLeft: overlap,
                zIndex: visibleAvatars.length + 1,
              },
            ]}
          >
            {/* Spinning gradient border */}
            <Animated.View
              style={[
                styles.spinningGradient,
                {
                  width: size * 2,
                  height: size * 2,
                  transform: [{ rotate: spin }],
                },
              ]}
            >
              <LinearGradient
                colors={[color.blue.dark, color.orange.dark, color.green.dark, color.blue.dark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientFill}
              />
            </Animated.View>
            {/* Inner circle */}
            <View
              style={[
                styles.badgeInner,
                {
                  width: innerSize,
                  height: innerSize,
                  borderRadius: innerSize / 2,
                },
              ]}
            >
              <Text style={[styles.countText, { fontSize: size * 0.3 }]}>
                +{displayCount}
              </Text>
            </View>
          </View>
        )}
      </View>
      {venueName && (
        <View style={styles.venueLabel}>
          <Text style={styles.venueName}>{venueName}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    borderWidth: 2,
    borderColor: color.white,
    overflow: 'hidden',
    backgroundColor: color.beige,
    shadowColor: color.charcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  badgeOuter: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinningGradient: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientFill: {
    width: '100%',
    height: '100%',
  },
  badgeInner: {
    backgroundColor: color.beige,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  countText: {
    ...typography.body,
    fontWeight: '700',
    color: color.charcoal,
  },
  venueLabel: {
    marginTop: spacing.xs + 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 9999,
    backgroundColor: color.beige + 'F2',
  },
  venueName: {
    fontSize: 10,
    fontWeight: '700',
    color: color.charcoal,
  },
});
