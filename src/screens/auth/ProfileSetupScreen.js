/**
 * Profile Setup Screen
 * Dark green theme with ghost-style inputs
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, Modal, FlatList, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronDown, Camera, X, Trash2, RefreshCw } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button, Input, Chip, DatePicker, Logo } from '../../components';
import { color, spacing, typography, radius } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';
import { getAge } from '../../lib/utils';

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria',
  'Bahrain', 'Bangladesh', 'Belgium', 'Brazil', 'Canada', 'Chile', 'China',
  'Colombia', 'Czech Republic', 'Denmark', 'Egypt', 'Finland', 'France',
  'Germany', 'Greece', 'Hungary', 'India', 'Indonesia', 'Iran', 'Iraq',
  'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan', 'Kenya', 'Kuwait',
  'Lebanon', 'Malaysia', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand',
  'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Philippines', 'Poland', 'Portugal',
  'Qatar', 'Romania', 'Russia', 'Saudi Arabia', 'Singapore', 'South Africa',
  'South Korea', 'Spain', 'Sweden', 'Switzerland', 'Thailand', 'Turkey',
  'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
  'Vietnam', 'Zimbabwe',
];

const INTERESTS = [
  { label: 'Music', emoji: '🎵' }, { label: 'Travel', emoji: '✈️' },
  { label: 'Food', emoji: '🍕' }, { label: 'Fitness', emoji: '💪' },
  { label: 'Art', emoji: '🎨' }, { label: 'Movies', emoji: '🎬' },
  { label: 'Reading', emoji: '📚' }, { label: 'Gaming', emoji: '🎮' },
  { label: 'Photography', emoji: '📸' }, { label: 'Dancing', emoji: '💃' },
  { label: 'Cooking', emoji: '👨‍🍳' }, { label: 'Nature', emoji: '🌿' },
  { label: 'Sports', emoji: '⚽' }, { label: 'Fashion', emoji: '👗' },
  { label: 'Tech', emoji: '💻' }, { label: 'Yoga', emoji: '🧘' },
  { label: 'Coffee', emoji: '☕' }, { label: 'Wine', emoji: '🍷' },
  { label: 'Nightlife', emoji: '🌙' }, { label: 'Beach', emoji: '🏖️' },
];

const themeColor = color.green.light;

export default function ProfileSetupScreen({ navigation }) {
  const { user, updateProfile, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    dateOfBirth: null,
    country: '',
    photo: null,
    bio: '',
    interests: [],
  });
  const [errors, setErrors] = useState({});
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [interestSearch, setInterestSearch] = useState('');

  const filteredInterests = INTERESTS.filter(
    (interest) =>
      interest.label.toLowerCase().includes(interestSearch.toLowerCase()) &&
      !formData.interests.includes(interest.label)
  );

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name';
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Please enter your date of birth';
    } else {
      const age = getAge(formData.dateOfBirth);
      if (age < 18) newErrors.dateOfBirth = 'You must be 18 or older';
      else if (age > 100) newErrors.dateOfBirth = 'Please enter a valid date';
    }
    if (!formData.country) newErrors.country = 'Please select your country';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoSelect = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access photos is required');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const uploadResult = await authService.uploadPhoto(user?.id, uri);
      if (uploadResult.success) {
        setFormData({ ...formData, photo: uploadResult.photoUrl });
        setErrors({ ...errors, photo: undefined });
      }
    }
  };

  const toggleInterest = (interest) => {
    if (formData.interests.includes(interest)) {
      setFormData({ ...formData, interests: formData.interests.filter((i) => i !== interest) });
    } else if (formData.interests.length < 5) {
      setFormData({ ...formData, interests: [...formData.interests, interest] });
      setInterestSearch('');
    }
  };

  const handleDateChange = (selectedDate) => {
    if (selectedDate) {
      setFormData({ ...formData, dateOfBirth: selectedDate });
      setErrors({ ...errors, dateOfBirth: undefined });
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const profileData = {
      name: formData.name.trim(),
      dateOfBirth: formData.dateOfBirth.toISOString(),
      age: getAge(formData.dateOfBirth),
      country: formData.country,
      photoUrl: formData.photo,
      bio: formData.bio.trim(),
      interests: formData.interests,
    };
    updateProfile(profileData);
    navigation.navigate('Location');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.8}>
          <ChevronLeft size={20} color={themeColor} />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
        <Logo size={32} color={themeColor} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>create your profile</Text>

        {/* Photo Upload */}
        <View style={styles.photoSection}>
          <TouchableOpacity onPress={!formData.photo ? handlePhotoSelect : undefined} style={styles.photoButton} activeOpacity={0.8}>
            {formData.photo ? (
              <Image source={{ uri: formData.photo }} style={styles.photoImage} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Camera size={32} color={themeColor} strokeWidth={1.5} />
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.photoText}>
            <Text style={styles.photoLabel}>Add a photo, show your best self</Text>
            {formData.photo && (
              <View style={styles.photoActions}>
                <TouchableOpacity onPress={handlePhotoSelect} style={styles.photoActionBtn}>
                  <RefreshCw size={16} color={themeColor} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFormData({ ...formData, photo: null })} style={styles.photoActionBtn}>
                  <Trash2 size={16} color={themeColor} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          {/* Name */}
          <View style={styles.inputGroup}>
            <Input
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Your name"
              maxLength={20}
              variant="ghost"
              themeColor={themeColor}
              error={errors.name}
            />
          </View>

          {/* Date of Birth */}
          <View style={styles.inputGroup}>
            <DatePicker
              value={formData.dateOfBirth}
              onChange={handleDateChange}
              error={errors.dateOfBirth}
              variant="ghost"
              themeColor={themeColor}
            />
          </View>

          {/* Country */}
          <View style={styles.inputGroup}>
            <TouchableOpacity onPress={() => setShowCountryPicker(true)} style={[styles.selectButton, errors.country && styles.selectError]}>
              <Text style={[styles.selectButtonText, !formData.country && styles.placeholderText]}>
                {formData.country || 'Select country'}
              </Text>
              <ChevronDown size={16} color={themeColor} />
            </TouchableOpacity>
            {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
          </View>
        </View>

        {/* Bio */}
        <View style={styles.bioSection}>
          <Text style={styles.sectionLabel}>Tell us about yourself</Text>
          <Input
            value={formData.bio}
            onChangeText={(text) => setFormData({ ...formData, bio: text })}
            placeholder="A little something about you..."
            multiline
            numberOfLines={3}
            maxLength={250}
            showCharacterCount
            variant="ghost"
            themeColor={themeColor}
          />
        </View>

        {/* Interests */}
        <View style={styles.interestsSection}>
          <Text style={styles.sectionLabel}>Pick your interests</Text>
          <Text style={styles.interestsSubtitle}>Choose up to 5</Text>

          {formData.interests.length > 0 && (
            <View style={styles.selectedInterests}>
              {formData.interests.map((interest) => {
                const data = INTERESTS.find((i) => i.label === interest);
                return (
                  <Chip
                    key={interest}
                    label={interest}
                    emoji={data?.emoji}
                    selected
                    onRemove={() => toggleInterest(interest)}
                    variant="ghost"
                    themeColor={themeColor}
                  />
                );
              })}
            </View>
          )}

          <Input
            value={interestSearch}
            onChangeText={setInterestSearch}
            placeholder="Search interests..."
            variant="ghost"
            themeColor={themeColor}
            containerStyle={styles.interestSearchContainer}
          />

          <View style={styles.interestSuggestions}>
            {(interestSearch ? filteredInterests : INTERESTS.filter((i) => !formData.interests.includes(i.label)).slice(0, 8)).map((interest) => (
              <Chip
                key={interest.label}
                label={interest.label}
                emoji={interest.emoji}
                onPress={() => toggleInterest(interest.label)}
                disabled={formData.interests.length >= 5}
                variant="ghost"
                themeColor={themeColor}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomSection}>
        <Button variant="outline-gradient" color="dark" fillColor={color.green.dark} size="lg" fullWidth onPress={handleSubmit} disabled={isLoading} loading={isLoading}>
          Continue
        </Button>
      </View>

      {/* Country Picker Modal */}
      <Modal visible={showCountryPicker} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
              <X size={24} color={themeColor} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={COUNTRIES}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setFormData({ ...formData, country: item });
                  setErrors({ ...errors, country: undefined });
                  setShowCountryPicker(false);
                }}
                style={[styles.countryItem, formData.country === item && styles.countryItemSelected]}
              >
                <Text style={[styles.countryItemText, formData.country === item && styles.countryItemTextSelected]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.green.dark },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  headerSpacer: { flex: 1 },
  backButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: themeColor + '20', alignItems: 'center', justifyContent: 'center' },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing['2xl'], paddingBottom: spacing.lg },
  title: { ...typography.h2, color: themeColor, marginBottom: spacing.xl },

  // Photo
  photoSection: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginBottom: spacing.xl },
  photoButton: { width: 96, height: 96, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: themeColor + '60' },
  photoPlaceholder: { width: '100%', height: '100%', backgroundColor: themeColor + '10', alignItems: 'center', justifyContent: 'center' },
  photoImage: { width: '100%', height: '100%' },
  photoText: { flex: 1 },
  photoLabel: { ...typography.caption, fontWeight: '700', color: themeColor },
  photoActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  photoActionBtn: { width: 32, height: 32, borderRadius: radius.full, backgroundColor: themeColor + '20', alignItems: 'center', justifyContent: 'center' },

  // Form
  formSection: { gap: spacing.md },
  inputGroup: {},
  selectButton: { height: 48, borderRadius: radius.full, borderWidth: 1, borderColor: themeColor + '60', paddingHorizontal: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  selectError: { borderColor: color.orange.light },
  selectButtonText: { ...typography.body, color: themeColor },
  placeholderText: { color: themeColor + '80' },
  errorText: { ...typography.caption, color: color.orange.light, marginTop: spacing.xs, marginLeft: spacing.sm },

  // Bio
  bioSection: { marginTop: spacing.xl },
  sectionLabel: { ...typography.caption, fontWeight: '700', color: themeColor, marginBottom: spacing.sm },

  // Interests
  interestsSection: { marginTop: spacing.xl },
  interestsSubtitle: { ...typography.caption, color: themeColor + '80', marginBottom: spacing.md },
  selectedInterests: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  interestSearchContainer: { marginBottom: spacing.md },
  interestSuggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },

  // Bottom
  bottomSection: { paddingHorizontal: spacing['2xl'], paddingVertical: spacing['2xl'] },

  // Modal
  modalContainer: { flex: 1, backgroundColor: color.green.dark },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: themeColor + '30' },
  modalTitle: { ...typography.h3, color: themeColor },
  countryItem: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: themeColor + '20' },
  countryItemSelected: { backgroundColor: themeColor + '30' },
  countryItemText: { ...typography.body, color: themeColor },
  countryItemTextSelected: { color: themeColor, fontWeight: '700' },
});
