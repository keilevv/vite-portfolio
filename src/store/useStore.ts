import { create } from "zustand";

interface StoreState {
  language: string;
  theme: string;
  setLanguage: (language: string) => void;
  setTheme: (theme: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  language: "en",
  theme: "dark",
  setLanguage: (language) => set({ language }),
  setTheme: (theme) => set({ theme }),
}));
