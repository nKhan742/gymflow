import { create } from 'zustand';

interface IProfilePreferencesState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useProfilePreferencesStore = create<IProfilePreferencesState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
