import { create } from 'zustand';

interface IExerciseCategoriesState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useExerciseCategoriesStore = create<IExerciseCategoriesState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
