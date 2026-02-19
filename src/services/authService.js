/**
 * Hactually Auth Service
 * Mock authentication service (replace with real API)
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId } from '../lib/utils';

// Safe dev mode check
const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';

// Mock user database key
const USERS_KEY = 'hactually_users';
const OTP_KEY = 'hactually_otps';

/**
 * Get all users from storage
 */
async function getUsers() {
  try {
    const data = await AsyncStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

/**
 * Save users to storage
 */
async function saveUsers(users) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * Generate a 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const authService = {
  /**
   * Send OTP to email/phone
   */
  async sendOTP(identifier) {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate OTP
      const otp = generateOTP();

      // Store OTP temporarily
      const otps = JSON.parse((await AsyncStorage.getItem(OTP_KEY)) || '{}');
      otps[identifier] = {
        code: otp,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      };
      await AsyncStorage.setItem(OTP_KEY, JSON.stringify(otps));

      console.log(`[DEV] OTP for ${identifier}: ${otp}`);

      return {
        success: true,
        devOTP: isDev ? otp : undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to send OTP',
      };
    }
  },

  /**
   * Verify OTP
   */
  async verifyOTP(identifier, code) {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get stored OTP
      const otps = JSON.parse((await AsyncStorage.getItem(OTP_KEY)) || '{}');
      const storedOTP = otps[identifier];

      // Check if OTP exists and is valid
      if (!storedOTP) {
        return { success: false, error: 'OTP expired or not found' };
      }

      if (Date.now() > storedOTP.expiresAt) {
        delete otps[identifier];
        await AsyncStorage.setItem(OTP_KEY, JSON.stringify(otps));
        return { success: false, error: 'OTP expired' };
      }

      if (storedOTP.code !== code) {
        return { success: false, error: 'Invalid OTP' };
      }

      // Clear used OTP
      delete otps[identifier];
      await AsyncStorage.setItem(OTP_KEY, JSON.stringify(otps));

      // Get or create user
      const users = await getUsers();
      let user = Object.values(users).find(
        (u) => u.email === identifier || u.phone === identifier
      );

      const isNewUser = !user;

      if (!user) {
        user = {
          id: generateId(12),
          email: identifier.includes('@') ? identifier : undefined,
          phone: !identifier.includes('@') ? identifier : undefined,
          createdAt: new Date().toISOString(),
          onboardingComplete: false,
        };
        users[user.id] = user;
        await saveUsers(users);
      }

      return {
        success: true,
        user,
        isNewUser,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Verification failed',
      };
    }
  },

  /**
   * Login with OAuth provider
   */
  async login(provider, credentials) {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const users = await getUsers();

      // Find existing user or create new one
      let user = Object.values(users).find(
        (u) => u.email === credentials.email
      );

      const isNewUser = !user;

      if (!user) {
        user = {
          id: generateId(12),
          email: credentials.email,
          name: credentials.name,
          provider,
          createdAt: new Date().toISOString(),
          onboardingComplete: false,
        };
        users[user.id] = user;
        await saveUsers(users);
      }

      return {
        success: true,
        user,
        isNewUser,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Login failed',
      };
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(userId, data) {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const users = await getUsers();

      if (!users[userId]) {
        return { success: false, error: 'User not found' };
      }

      users[userId] = {
        ...users[userId],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      await saveUsers(users);

      return {
        success: true,
        user: users[userId],
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update profile',
      };
    }
  },

  /**
   * Upload photo (mock - stores as base64 or URI)
   */
  async uploadPhoto(userId, imageUri) {
    try {
      // In a real app, this would upload to a server
      // For now, just return the local URI
      return {
        success: true,
        photoUrl: imageUri,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to upload photo',
      };
    }
  },
};
