import { create } from 'zustand';

interface ICategoriesState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useCategoriesStore = create<ICategoriesState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
