import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface WalletState {
  favorites: string[];
  searchHistory: string[];
  publicKey: string | null;
  authToken: string | null;
  isDevnet: boolean;

  setPublicKey: (key: string | null) => void;
  setAuthToken: (token: string | null) => void;

  addFavorite: (address: string) => void;
  removeFavorite: (address: string) => void;
  toggleFavorite: (address: string) => void;
  isFavorite: (address: string) => boolean;
  addToHistory: (address: string) => void;
  clearHistory: () => void;
  toggleNetwork: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      favorites: [],
      searchHistory: [],
      isDevnet: true,
      publicKey: null,
      authToken: null,

      setPublicKey: (key) => set({ publicKey: key }),
      setAuthToken: (token) => set({ authToken: token }),

      addFavorite: (address) =>
        set((state) => ({
          favorites: state.favorites.includes(address)
            ? state.favorites
            : [address, ...state.favorites],
        })),

      removeFavorite: (address) =>
        set((state) => ({
          favorites: state.favorites.filter((a) => a !== address),
        })),

      toggleFavorite: (address) =>
        set((state) => {
          const isFav = state.favorites.includes(address);
          return {
            favorites: isFav
              ? state.favorites.filter((a) => a !== address)
              : [address, ...state.favorites],
          };
        }),

      isFavorite: (address) => get().favorites.includes(address),

      addToHistory: (address) =>
        set((state) => ({
          searchHistory: [
            address,
            ...state.searchHistory.filter((a) => a !== address),
          ].slice(0, 20),
        })),

      clearHistory: () => set({ searchHistory: [] }),

      toggleNetwork: () => set((state) => ({ isDevnet: !state.isDevnet })),
    }),
    {
      name: "wallet-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);