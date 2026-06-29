import { create } from 'zustand';

interface UIStore {
  showShop: boolean;
  showSettings: boolean;
  showResult: boolean;
  showRestrictionIntro: boolean;
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info';

  setShowShop: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;
  setShowResult: (show: boolean) => void;
  setShowRestrictionIntro: (show: boolean) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  clearToast: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  showShop: false,
  showSettings: false,
  showResult: false,
  showRestrictionIntro: false,
  toastMessage: null,
  toastType: 'info',

  setShowShop: (show: boolean) => set({ showShop: show }),
  setShowSettings: (show: boolean) => set({ showSettings: show }),
  setShowResult: (show: boolean) => set({ showResult: show }),
  setShowRestrictionIntro: (show: boolean) => set({ showRestrictionIntro: show }),

  showToast: (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    set({ toastMessage: message, toastType: type });
  },

  clearToast: () => set({ toastMessage: null, toastType: 'info' }),
}));
