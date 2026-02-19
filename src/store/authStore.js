/**
 * Hactually Auth Store
 * Zustand store for authentication state management
 */
import { create } from 'zustand';
import { authService } from '../services/authService';

export const useAuthStore = create((set, get) => ({
      // User state
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Onboarding progress
      onboardingStep: 0, // 0: not started, 1: basic info, 2: photo, 3: location, 4: complete

      // Auth actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setLoading: (isLoading) => set({ isLoading }),

      setOnboardingStep: (step) => set({ onboardingStep: step }),

      // Update user profile during onboarding
      updateProfile: (data) =>
        set((state) => ({
          user: { ...state.user, ...data },
        })),

      // Login with provider (Apple, Google, Email)
      login: async (provider, credentials) => {
        set({ isLoading: true });
        try {
          const result = await authService.login(provider, credentials);

          if (result.success) {
            set({
              user: result.user,
              isAuthenticated: true,
              onboardingStep: result.user.onboardingComplete ? 4 : 0,
            });
          }
          return result;
        } finally {
          set({ isLoading: false });
        }
      },

      // Verify OTP
      verifyOTP: async (identifier, otp) => {
        set({ isLoading: true });
        try {
          const result = await authService.verifyOTP(identifier, otp);

          if (result.success) {
            set({
              user: result.user,
              isAuthenticated: true,
              onboardingStep: result.user.onboardingComplete ? 4 : 0,
            });
          }
          return result;
        } finally {
          set({ isLoading: false });
        }
      },

      // Send OTP to email/phone
      sendOTP: async (identifier) => {
        set({ isLoading: true });
        try {
          return await authService.sendOTP(identifier);
        } finally {
          set({ isLoading: false });
        }
      },

      // Complete profile setup
      completeProfile: async (profileData) => {
        set({ isLoading: true });
        try {
          const result = await authService.updateProfile(
            get().user?.id,
            profileData
          );

          if (result.success) {
            set((state) => ({
              user: { ...state.user, ...profileData, onboardingComplete: true },
              onboardingStep: 4,
            }));
          }
          return result;
        } finally {
          set({ isLoading: false });
        }
      },

      // Logout
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          onboardingStep: 0,
        });
      },

    // Reset store (for testing)
  reset: () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      onboardingStep: 0,
    });
  },
}));
