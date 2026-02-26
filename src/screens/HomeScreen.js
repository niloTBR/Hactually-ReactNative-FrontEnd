/**
 * Home Screen
 * Main screen after onboarding - placeholder for now
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, LogOut, Palette } from 'lucide-react-native';
import { colors, spacing, fontSize, borderRadius } from '../theme';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>hactually</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('StyleGuide')}
          style={styles.iconButton}
        >
          <Palette size={20} color={colors.olive.default} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome, {user?.name || 'User'}!</Text>
          <Text style={styles.welcomeSubtitle}>
            Your profile is all set up. This is where the main app would be.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Profile Info</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Country:</Text>
            <Text style={styles.infoValue}>{user?.country || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age:</Text>
            <Text style={styles.infoValue}>{user?.age || 'N/A'}</Text>
          </View>
          {user?.interests?.length > 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Interests:</Text>
              <Text style={styles.infoValue}>{user.interests.join(', ')}</Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <Button
            onPress={() => navigation.navigate('StyleGuide')}
            variant="outline"
            color="blue"
            fullWidth
            leftIcon={<Palette size={16} color={colors.blue.default} />}
          >
            View Design System
          </Button>

          <Button
            onPress={logout}
            variant="outline"
            color="orange"
            fullWidth
            leftIcon={<LogOut size={16} color={colors.orange.default} />}
          >
            Sign Out
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.olive.lighter,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  logo: {
    fontSize: fontSize.xl,
    fontWeight: '900',
    color: colors.blue.default,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.olive.light + '4D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  welcomeCard: {
    backgroundColor: colors.blue.default,
    borderRadius: borderRadius['2xl'],
    padding: spacing[6],
    marginBottom: spacing[4],
  },
  welcomeTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing[2],
  },
  welcomeSubtitle: {
    fontSize: fontSize.sm,
    color: colors.blue.light,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius['2xl'],
    padding: spacing[6],
    marginBottom: spacing[6],
  },
  infoTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing[4],
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: spacing[2],
  },
  infoLabel: {
    fontSize: fontSize.sm,
    color: colors.olive.default,
    width: 100,
  },
  infoValue: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.black,
    fontWeight: '500',
  },
  actions: {
    gap: spacing[3],
  },
});
