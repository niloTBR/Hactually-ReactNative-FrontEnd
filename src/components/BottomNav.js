/**
 * BottomNav - Bottom navigation bar
 * Orange pill container that hugs content width, centered
 * Active tab has blue pill background with label
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { color, spacing, radius, typography } from '../theme';
import { HomeIcon, MatchesIcon, ProfileIcon, SpotsIcon } from './Icons';

const VENUE_IMAGES = {
  '1': require('../../assets/venues/1.jpg'),
  '2': require('../../assets/venues/2.jpg'),
  '3': require('../../assets/venues/3.webp'),
  '4': require('../../assets/venues/4.jpg'),
  '5': require('../../assets/venues/5.jpeg'),
  '6': require('../../assets/venues/6.jpg'),
};

const TABS = [
  { key: 'nearby', label: 'Nearby', icon: HomeIcon },
  { key: 'spots', label: 'Spots', icon: SpotsIcon },
  { key: 'likes', label: 'Inbox', icon: MatchesIcon },
  { key: 'profile', label: 'Profile', icon: ProfileIcon },
];

export default function BottomNav({ activeTab = 'nearby', onTabChange, checkedInVenue, hasNewMatches = true }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (hasNewMatches && activeTab !== 'likes') {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      );
      anim.start();
      return () => anim.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [hasNewMatches, activeTab]);

  return (
    <View style={styles.outerWrap}>
      <View style={styles.container}>
        {TABS.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          const isPulsing = (key === 'likes' || key === 'spots') && hasNewMatches && !isActive;
          return (
            <React.Fragment key={key}>
              <TouchableOpacity
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => onTabChange?.(key)}
                activeOpacity={0.8}
              >
                {isPulsing ? (
                  <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <Icon size={22} color={color.beige + 'CC'} />
                  </Animated.View>
                ) : (
                  <Icon
                    size={22}
                    color={isActive ? color.white : color.beige + 'CC'}
                  />
                )}
                {isActive && <Text style={styles.tabLabel}>{label}</Text>}
              </TouchableOpacity>
              {key === 'nearby' && checkedInVenue && (
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'venue' && styles.tabActiveVenue]}
                  onPress={() => onTabChange?.('venue')}
                  activeOpacity={0.8}
                >
                  <Image source={checkedInVenue.image || VENUE_IMAGES[checkedInVenue.id] || VENUE_IMAGES['1']} style={styles.venueThumb} />
                  {activeTab === 'venue' && <Text style={styles.tabLabel}>My Venue</Text>}
                </TouchableOpacity>
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrap: {
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.orange.dark,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
    alignSelf: 'center',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    gap: spacing.sm,
  },
  tabActive: {
    backgroundColor: color.blue.dark,
  },
  tabActiveVenue: {
    backgroundColor: color.blue.dark,
    paddingHorizontal: spacing.xs,
    paddingRight: spacing.md,
  },
  tabLabel: {
    fontFamily: 'Ezra-Bold',
    fontSize: 13,
    fontWeight: '700',
    color: color.white,
  },
  venueThumb: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: color.white + '80',
    overflow: 'hidden',
    resizeMode: 'cover',
  },
});
