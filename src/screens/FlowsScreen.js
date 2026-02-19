/**
 * Flows Screen - Accordion-based flow navigation
 * Based on Miro Tech Spec
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ChevronDown, ChevronRight, Eye, LogOut, Palette } from 'lucide-react-native';
import { colors, spacing, borderRadius, fontFamily } from '../theme';
import { useAuthStore } from '../store/authStore';

const FLOW_SECTIONS = [
  {
    id: 'onboarding',
    title: 'Onboarding & Account Creation',
    description: 'Allows the user to understand the value proposition, securely create their account, and build a profile.',
    screens: [
      { id: '1A', name: 'See the app introduction', path: 'Welcome', active: true },
      { id: '1B', name: 'Sign up or log in with email', path: 'AuthOptions', active: true },
      { id: '1C', name: 'Set up my Hactually profile', path: 'ProfileSetup', active: true },
    ],
  },
  {
    id: 'home',
    title: 'Home & Discovery',
    description: 'Enables the user to find and explore venues where real people are right now.',
    screens: [
      { id: '2A', name: 'Discover nearby venues on map', active: false },
      { id: '2B', name: 'See message when no venues nearby', active: false },
    ],
  },
  {
    id: 'venue',
    title: 'Venue Experience',
    description: 'Lets the user check into a location and engage with people in the same space.',
    screens: [
      { id: '3A', name: 'View details on a venue', active: false },
      { id: '3B', name: 'Check into a venue', active: false },
      { id: '3C', name: 'Chat with everyone at venue', active: false },
    ],
  },
  {
    id: 'profiles',
    title: 'Profiles & Spotting',
    description: 'Gives the user a way to learn about someone and express interest.',
    screens: [
      { id: '4A', name: 'See who is checked in', active: false },
      { id: '4B', name: 'View someone\'s profile', active: false },
      { id: '4C', name: 'Spot someone', active: false },
      { id: '4D', name: 'Receive spot notification', active: false },
      { id: '4E', name: 'Spot back or decline', active: false },
    ],
  },
  {
    id: 'communication',
    title: 'Messaging',
    description: 'Provides a private space for matched users to get to know each other.',
    screens: [
      { id: '5A', name: 'See all conversations', active: false },
      { id: '5B', name: 'Private conversation with match', active: false },
      { id: '5C', name: 'Send photos in chat', active: false },
    ],
  },
  {
    id: 'matches',
    title: 'Matches & Interest',
    description: 'Helps the user keep track of their connections.',
    screens: [
      { id: '6A', name: 'View all matches', active: false },
      { id: '6B', name: 'See who spotted me', active: false },
      { id: '6C', name: 'Review spots I\'ve sent', active: false },
      { id: '6D', name: 'Unmatch with someone', active: false },
    ],
  },
  {
    id: 'monetization',
    title: 'Premium & Purchases',
    description: 'Offers the user ways to stand out and get more from the app.',
    screens: [
      { id: '7A', name: 'Understand premium features', active: false },
      { id: '7B', name: 'Purchase credits', active: false },
      { id: '7C', name: 'Choose subscription plan', active: false },
    ],
  },
  {
    id: 'settings',
    title: 'Settings & My Profile',
    description: 'Puts the user in control of how they present themselves.',
    screens: [
      { id: '8A', name: 'View or edit my profile', active: false },
      { id: '8B', name: 'Manage privacy preferences', active: false },
      { id: '8C', name: 'Manage notifications', active: false },
      { id: '8D', name: 'Manage my account', active: false },
    ],
  },
];

// Screen Item Component
const ScreenItem = ({ screen, onPress }) => {
  const isActive = screen.active;
  const hasPath = screen.path;

  return (
    <TouchableOpacity
      style={styles.screenItem}
      onPress={() => hasPath && isActive && onPress(screen.path)}
      disabled={!hasPath || !isActive}
      activeOpacity={0.7}
    >
      <View style={[styles.screenId, isActive ? styles.screenIdActive : styles.screenIdInactive]}>
        <Text style={[styles.screenIdText, isActive ? styles.screenIdTextActive : styles.screenIdTextInactive]}>
          {screen.id}
        </Text>
      </View>
      <Text style={[styles.screenName, isActive ? styles.screenNameActive : styles.screenNameInactive]}>
        {screen.name}
      </Text>
      <View style={[styles.statusDot, isActive ? styles.statusDotActive : styles.statusDotInactive]} />
    </TouchableOpacity>
  );
};

// Flow Accordion Component
const FlowAccordion = ({ flow, index, isExpanded, onToggle, onNavigate }) => {
  const activeCount = flow.screens.filter(s => s.active).length;
  const totalCount = flow.screens.length;

  return (
    <View style={styles.accordion}>
      <TouchableOpacity style={styles.accordionHeader} onPress={onToggle} activeOpacity={0.8}>
        <View style={styles.flowNumber}>
          <Text style={styles.flowNumberText}>{index + 1}</Text>
        </View>
        <View style={styles.flowInfo}>
          <Text style={styles.flowTitle}>{flow.title}</Text>
          <Text style={styles.flowDescription} numberOfLines={2}>{flow.description}</Text>
        </View>
        <View style={styles.flowMeta}>
          <Text style={styles.flowCount}>
            <Text style={styles.flowCountActive}>{activeCount}</Text>/{totalCount}
          </Text>
          {isExpanded ? (
            <ChevronDown size={20} color={colors.brown.default} />
          ) : (
            <ChevronRight size={20} color={colors.brown.light} />
          )}
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.accordionContent}>
          {flow.screens.map((screen) => (
            <ScreenItem key={screen.id} screen={screen} onPress={onNavigate} />
          ))}
        </View>
      )}
    </View>
  );
};

export default function FlowsScreen({ navigation }) {
  const { logout, isAuthenticated } = useAuthStore();
  const [expandedFlow, setExpandedFlow] = useState(null);

  const toggleFlow = (flowId) => {
    setExpandedFlow(prev => prev === flowId ? null : flowId);
  };

  const handleNavigate = (path) => {
    navigation.navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigation.navigate('Welcome');
  };

  const totalScreens = FLOW_SECTIONS.reduce((acc, flow) => acc + flow.screens.length, 0);
  const builtScreens = FLOW_SECTIONS.reduce((acc, flow) =>
    acc + flow.screens.filter(s => s.active).length, 0
  );
  const progressPercent = Math.round((builtScreens / totalScreens) * 100);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>hactually</Text>
          <Text style={styles.subtitle}>User Stories - MVP</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.designSystemButton}
            onPress={() => navigation.navigate('StyleGuide')}
          >
            <Palette size={16} color={colors.blue.default} />
            <Text style={styles.designSystemText}>Design System</Text>
          </TouchableOpacity>
          {isAuthenticated && (
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut size={16} color={colors.orange.default} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <View style={[styles.statDot, styles.statDotBuilt]} />
            <Text style={styles.statText}>Built ({builtScreens})</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statDot, styles.statDotToBuild]} />
            <Text style={styles.statTextMuted}>To Build ({totalScreens - builtScreens})</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {progressPercent}% complete - {builtScreens}/{totalScreens} stories
        </Text>

        {/* Flow Accordions */}
        <View style={styles.accordions}>
          {FLOW_SECTIONS.map((flow, index) => (
            <FlowAccordion
              key={flow.id}
              flow={flow}
              index={index}
              isExpanded={expandedFlow === flow.id}
              onToggle={() => toggleFlow(flow.id)}
              onNavigate={handleNavigate}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brown.lighter,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderBottomWidth: 1,
    borderBottomColor: colors.brown.light + '50',
  },
  logo: {
    fontSize: 22,
    fontFamily: fontFamily.black,
    fontWeight: '900',
    color: colors.blue.default,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: fontFamily.regular,
    color: colors.brown.default,
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  designSystemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.blue.default + '15',
  },
  designSystemText: {
    fontSize: 13,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.blue.default,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.orange.default + '15',
  },
  logoutText: {
    fontSize: 13,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.orange.default,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing[6],
    paddingBottom: spacing[12],
  },
  stats: {
    flexDirection: 'row',
    gap: spacing[6],
    marginBottom: spacing[4],
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statDotBuilt: {
    backgroundColor: colors.green.default,
  },
  statDotToBuild: {
    backgroundColor: colors.brown.light,
  },
  statText: {
    fontSize: 12,
    fontFamily: fontFamily.medium,
    color: colors.brown.default,
  },
  statTextMuted: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: colors.brown.default + '99',
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.brown.light + '60',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing[2],
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.blue.default,
    borderRadius: borderRadius.full,
  },
  progressText: {
    fontSize: 12,
    fontFamily: fontFamily.medium,
    color: colors.brown.default,
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  accordions: {
    gap: spacing[3],
  },
  accordion: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.brown.light + '60',
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    gap: spacing[3],
  },
  flowNumber: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.blue.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flowNumberText: {
    fontSize: 14,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: 'white',
  },
  flowInfo: {
    flex: 1,
  },
  flowTitle: {
    fontSize: 14,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: 'black',
  },
  flowDescription: {
    fontSize: 11,
    fontFamily: fontFamily.regular,
    color: colors.brown.default,
    marginTop: 2,
  },
  flowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  flowCount: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: colors.brown.default,
  },
  flowCountActive: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.green.default,
  },
  accordionContent: {
    borderTopWidth: 1,
    borderTopColor: colors.brown.light + '40',
    backgroundColor: colors.brown.lighter + '50',
  },
  screenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.brown.light + '30',
  },
  screenId: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  screenIdActive: {
    backgroundColor: colors.green.light,
  },
  screenIdInactive: {
    backgroundColor: colors.brown.light + '50',
  },
  screenIdText: {
    fontSize: 11,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
  },
  screenIdTextActive: {
    color: colors.green.default,
  },
  screenIdTextInactive: {
    color: colors.brown.default,
  },
  screenName: {
    flex: 1,
    fontSize: 13,
  },
  screenNameActive: {
    fontFamily: fontFamily.medium,
    color: 'black',
  },
  screenNameInactive: {
    fontFamily: fontFamily.regular,
    color: colors.brown.default,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusDotActive: {
    backgroundColor: colors.green.default,
  },
  statusDotInactive: {
    backgroundColor: colors.brown.light,
  },
});
