/**
 * BottomNav - Bottom navigation bar
 * Orange pill container that hugs content width, centered
 * Active tab has blue pill background with label
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Navigation, Heart, User } from 'lucide-react-native';
import { color, spacing, radius, typography } from '../theme';

const TABS = [
  { key: 'nearby', label: 'Nearby', icon: Navigation },
  { key: 'likes', label: 'Matches', icon: Heart },
  { key: 'profile', label: 'Profile', icon: User },
];

export default function BottomNav({ activeTab = 'nearby', onTabChange }) {
  return (
    <View style={styles.outerWrap}>
      <View style={styles.container}>
        {TABS.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <TouchableOpacity
              key={key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => onTabChange?.(key)}
              activeOpacity={0.8}
            >
              <Icon
                size={20}
                color={isActive ? color.white : color.beige + 'CC'}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              {isActive && <Text style={styles.tabLabel}>{label}</Text>}
            </TouchableOpacity>
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
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    gap: spacing.sm,
  },
  tabActive: {
    backgroundColor: color.blue.dark,
    paddingHorizontal: spacing.xl,
  },
  tabLabel: {
    fontFamily: 'Ezra-Bold',
    fontSize: 13,
    fontWeight: '700',
    color: color.white,
  },
});
