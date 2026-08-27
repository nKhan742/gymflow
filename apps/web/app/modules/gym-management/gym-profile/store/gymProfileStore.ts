import { create } from 'zustand';

interface IGymProfileState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useGymProfileStore = create<IGymProfileState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
