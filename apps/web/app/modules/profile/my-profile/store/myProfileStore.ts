import { create } from 'zustand';

interface IMyProfileState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useMyProfileStore = create<IMyProfileState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
