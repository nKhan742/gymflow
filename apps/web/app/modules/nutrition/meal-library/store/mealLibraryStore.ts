import { create } from 'zustand';

interface IMealLibraryState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useMealLibraryStore = create<IMealLibraryState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
