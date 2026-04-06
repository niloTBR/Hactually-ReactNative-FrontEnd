import { create } from 'zustand';

export const useVenueStore = create((set) => ({
  checkedInVenue: null,
  checkIn: (venue) => set({ checkedInVenue: venue }),
  checkOut: () => set({ checkedInVenue: null }),
}));
