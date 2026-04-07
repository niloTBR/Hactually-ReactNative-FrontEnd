/**
 * VenueCard - Venue card for horizontal carousel
 * Grayscale image + blue color tint overlay
 * Uses PeopleMarker component for avatar stack (same component as map markers)
 */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import { color, spacing, radius, typography } from '../theme';
import PeopleMarker from './PeopleMarker';

const CARD_HEIGHT = 160;

export default function VenueCard({ venue, onPress }) {
  const {
    name,
    image,
    category,
    area,
    distance,
    people = [],
    peopleCount = 0,
  } = venue;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={onPress}
    >
      {/* Grayscale image base */}
      <Image
        source={typeof image === 'string' ? { uri: image } : image}
        style={[styles.backgroundImage, { filter: 'grayscale(1)' }]}
      />
      {/* Blue duotone gradient — lighter top, darker bottom */}
      <LinearGradient
        colors={[color.blue.dark + '70', color.blue.dark + 'CC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Venue name - vertically centered */}
        <View style={styles.nameArea}>
          <Text style={styles.venueName}>{name}</Text>
        </View>

        {/* Bottom row */}
        <View style={styles.bottomRow}>
          {/* Same PeopleMarker component, smaller size for cards */}
          <PeopleMarker
            people={people}
            count={peopleCount}
            size={36}
            overlap={-20}
          />

          {/* Venue info */}
          <View style={styles.venueInfo}>
            <Text style={styles.categoryText}>{category}</Text>
            <Text style={styles.distanceText}>
              {area}{distance ? ` · ${distance}` : ''}
            </Text>
          </View>

          {/* Chevron */}
          <View style={styles.chevronContainer}>
            <ChevronRight size={20} color={color.white} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  nameArea: {
    flex: 1,
    justifyContent: 'center',
  },
  venueName: {
    ...typography.h4,
    color: color.white,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  categoryText: {
    ...typography.body,
    fontWeight: '700',
    color: color.white,
  },
  distanceText: {
    ...typography.body,
    fontWeight: '400',
    color: color.white + 'B3',
  },
  chevronContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.xl,
    backgroundColor: color.white + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
