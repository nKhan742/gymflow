import { create } from 'zustand';

interface ISettingsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useSettingsStore = create<ISettingsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
