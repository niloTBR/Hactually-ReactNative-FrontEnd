/**
 * Profile Setup Screen
 * Name, DOB, country, photo, bio, interests
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,
  Image, Modal, FlatList, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronDown, Camera, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import DatePicker from '../../components/DatePicker';
import { colors, spacing, fontSize, borderRadius, shadows, fontFamily } from '../../theme';
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
  { label: 'Music', emoji: '🎵' },
  { label: 'Travel', emoji: '✈️' },
  { label: 'Food', emoji: '🍕' },
  { label: 'Fitness', emoji: '💪' },
  { label: 'Art', emoji: '🎨' },
  { label: 'Movies', emoji: '🎬' },
  { label: 'Reading', emoji: '📚' },
  { label: 'Gaming', emoji: '🎮' },
  { label: 'Photography', emoji: '📸' },
  { label: 'Dancing', emoji: '💃' },
  { label: 'Cooking', emoji: '👨‍🍳' },
  { label: 'Nature', emoji: '🌿' },
  { label: 'Sports', emoji: '⚽' },
  { label: 'Fashion', emoji: '👗' },
  { label: 'Tech', emoji: '💻' },
  { label: 'Yoga', emoji: '🧘' },
  { label: 'Coffee', emoji: '☕' },
  { label: 'Wine', emoji: '🍷' },
  { label: 'Nightlife', emoji: '🌙' },
  { label: 'Beach', emoji: '🏖️' },
];

export default function ProfileSetupScreen({ navigation }) {
  const { user, updateProfile, setOnboardingStep, isLoading } = useAuthStore();

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

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Please enter your date of birth';
    } else {
      const age = getAge(formData.dateOfBirth);
      if (age < 18) {
        newErrors.dateOfBirth = 'You must be 18 or older';
      } else if (age > 100) {
        newErrors.dateOfBirth = 'Please enter a valid date';
      }
    }

    if (!formData.country) {
      newErrors.country = 'Please select your country';
    }

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
      setFormData({
        ...formData,
        interests: formData.interests.filter((i) => i !== interest),
      });
    } else if (formData.interests.length < 5) {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest],
      });
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <ChevronLeft size={20} color={colors.brown.default} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>Create your profile</Text>

        {/* Photo Upload */}
        <View style={styles.photoSection}>
          <TouchableOpacity
            onPress={handlePhotoSelect}
            style={styles.photoButton}
            activeOpacity={0.8}
          >
            {formData.photo ? (
              <Image source={{ uri: formData.photo }} style={styles.photoImage} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Camera size={32} color={colors.brown.default} strokeWidth={1.5} />
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.photoText}>
            <Text style={styles.photoLabel}>Add a photo, show your best self</Text>
            {formData.photo && (
              <TouchableOpacity onPress={handlePhotoSelect}>
                <Text style={styles.changePhotoText}>Change photo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          {/* Name */}
          <View style={styles.inputGroup}>
            <TextInput
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Your name"
              placeholderTextColor={colors.brown.default + '80'}
              maxLength={20}
              style={[styles.input, errors.name && styles.inputError]}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Date of Birth */}
          <View style={styles.inputGroup}>
            <DatePicker
              value={formData.dateOfBirth}
              onChange={handleDateChange}
              error={errors.dateOfBirth}
            />
          </View>

          {/* Country */}
          <View style={styles.inputGroup}>
            <TouchableOpacity
              onPress={() => setShowCountryPicker(true)}
              style={[styles.selectButton, errors.country && styles.inputError]}
            >
              <Text
                style={[
                  styles.selectButtonText,
                  !formData.country && styles.placeholderText,
                ]}
              >
                {formData.country || 'Select country'}
              </Text>
              <ChevronDown size={16} color={colors.brown.default} />
            </TouchableOpacity>
            {errors.country && (
              <Text style={styles.errorText}>{errors.country}</Text>
            )}
          </View>
        </View>

        {/* Bio */}
        <View style={styles.bioSection}>
          <Text style={styles.sectionLabel}>Tell us about yourself</Text>
          <View style={styles.bioInputWrapper}>
            <TextInput
              value={formData.bio}
              onChangeText={(text) => setFormData({ ...formData, bio: text.slice(0, 250) })}
              placeholder="A little something about you..."
              placeholderTextColor={colors.brown.default + '80'}
              multiline
              numberOfLines={3}
              style={styles.bioInput}
            />
            <Text style={styles.bioCounter}>{formData.bio.length}/250</Text>
          </View>
        </View>

        {/* Interests */}
        <View style={styles.interestsSection}>
          <Text style={styles.sectionLabel}>Pick your interests</Text>
          <Text style={styles.interestsSubtitle}>Choose up to 5</Text>

          {/* Selected interests */}
          {formData.interests.length > 0 && (
            <View style={styles.selectedInterests}>
              {formData.interests.map((interest) => {
                const data = INTERESTS.find((i) => i.label === interest);
                return (
                  <TouchableOpacity
                    key={interest}
                    onPress={() => toggleInterest(interest)}
                    style={styles.selectedInterestChip}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.selectedInterestEmoji}>{data?.emoji}</Text>
                    <Text style={styles.selectedInterestText}>{interest}</Text>
                    <X size={12} color={colors.white} />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Search */}
          <TextInput
            value={interestSearch}
            onChangeText={setInterestSearch}
            placeholder="Search interests..."
            placeholderTextColor={colors.brown.default + '80'}
            style={styles.interestSearch}
          />

          {/* Suggestions */}
          <View style={styles.interestSuggestions}>
            {(interestSearch
              ? filteredInterests
              : INTERESTS.filter((i) => !formData.interests.includes(i.label)).slice(0, 8)
            ).map((interest) => (
              <TouchableOpacity
                key={interest.label}
                onPress={() => toggleInterest(interest.label)}
                disabled={formData.interests.length >= 5}
                style={[
                  styles.interestChip,
                  formData.interests.length >= 5 && styles.interestChipDisabled,
                ]}
                activeOpacity={0.8}
              >
                <Text style={styles.interestEmoji}>{interest.emoji}</Text>
                <Text style={styles.interestText}>{interest.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.orange.default} />
          ) : (
            <Text style={styles.submitButtonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryPicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
              <X size={24} color={colors.black} />
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
                style={[
                  styles.countryItem,
                  formData.country === item && styles.countryItemSelected,
                ]}
              >
                <Text
                  style={[
                    styles.countryItemText,
                    formData.country === item && styles.countryItemTextSelected,
                  ]}
                >
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
  container: {
    flex: 1,
    backgroundColor: colors.brown.lighter,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.brown.light + '4D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[4],
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.blue.default,
    marginBottom: spacing[6],
  },
  photoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    marginBottom: spacing[6],
  },
  photoButton: {
    width: 96,
    height: 96,
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.brown.light + '66',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoText: {
    flex: 1,
  },
  photoLabel: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.blue.default,
  },
  changePhotoText: {
    fontSize: fontSize.xs,
    color: colors.blue.default,
    marginTop: spacing[1],
  },
  formSection: {
    gap: spacing[3],
  },
  inputGroup: {},
  input: {
    height: 48,
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.brown.light + '4D',
    paddingHorizontal: spacing[4],
    fontSize: fontSize.sm,
    color: colors.black,
    outlineStyle: 'none',
    ...shadows.card,
  },
  inputError: {
    borderColor: colors.orange.default,
  },
  selectButton: {
    height: 48,
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.brown.light + '4D',
    paddingHorizontal: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.card,
  },
  selectButtonText: {
    fontSize: fontSize.sm,
    color: colors.black,
  },
  placeholderText: {
    color: colors.brown.default + '80',
  },
  errorText: {
    fontSize: fontSize.xs,
    color: colors.orange.default,
    marginTop: spacing[1],
    marginLeft: spacing[2],
  },
  bioSection: {
    marginTop: spacing[6],
  },
  sectionLabel: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.blue.default,
    marginBottom: spacing[2],
  },
  bioInputWrapper: {
    position: 'relative',
  },
  bioInput: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.brown.light + '4D',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[6],
    fontSize: fontSize.sm,
    color: colors.black,
    minHeight: 80,
    textAlignVertical: 'top',
    outlineStyle: 'none',
    ...shadows.card,
  },
  bioCounter: {
    position: 'absolute',
    bottom: spacing[2],
    right: spacing[3],
    fontSize: 10,
    color: colors.brown.default + '66',
  },
  interestsSection: {
    marginTop: spacing[6],
  },
  interestsSubtitle: {
    fontSize: fontSize.xs,
    color: colors.brown.default,
    marginBottom: spacing[3],
  },
  selectedInterests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  selectedInterestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
    height: 32,
    paddingHorizontal: spacing[3],
    backgroundColor: colors.blue.default,
    borderRadius: borderRadius.full,
  },
  selectedInterestEmoji: {
    fontSize: 14,
  },
  selectedInterestText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
    color: colors.white,
  },
  interestSearch: {
    height: 40,
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.brown.light + '4D',
    paddingHorizontal: spacing[4],
    fontSize: fontSize.sm,
    color: colors.black,
    marginBottom: spacing[3],
    outlineStyle: 'none',
  },
  interestSuggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
    height: 32,
    paddingHorizontal: spacing[3],
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.brown.light + '4D',
  },
  interestChipDisabled: {
    opacity: 0.5,
  },
  interestEmoji: {
    fontSize: 14,
  },
  interestText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
    color: colors.brown.default,
  },
  bottomSection: {
    paddingHorizontal: 32,
    paddingVertical: 32,
  },
  submitButton: {
    height: 48,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.orange.default,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 11,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.orange.default,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.brown.light + '4D',
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.black,
  },
  countryItem: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.brown.light + '26',
  },
  countryItemSelected: {
    backgroundColor: colors.blue.light + '26',
  },
  countryItemText: {
    fontSize: fontSize.sm,
    color: colors.brown.default,
  },
  countryItemTextSelected: {
    color: colors.black,
    fontWeight: '500',
  },
});
