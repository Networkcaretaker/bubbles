import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Settings for this device only (saved in the browser), e.g. a slow phone can turn the animation off
interface SettingsState {
  backgroundAnimation: boolean;
  setBackgroundAnimation: (on: boolean) => void;
}

// Falls back to memory-only storage if the browser blocks localStorage (e.g. some private windows)
const safeStorage = createJSONStorage(() => {
  try {
    localStorage.setItem('bubbles-test', '1');
    localStorage.removeItem('bubbles-test');
    return localStorage;
  } catch {
    const memory = new Map<string, string>();
    return {
      getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => void memory.set(key, value),
      removeItem: (key: string) => void memory.delete(key),
    };
  }
});

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      backgroundAnimation: false,
      setBackgroundAnimation: (on) => set({ backgroundAnimation: on }),
    }),
    { name: 'bubbles-settings', storage: safeStorage },
  ),
);
