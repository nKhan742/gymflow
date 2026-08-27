import { create } from 'zustand';

interface IExerciseLibraryState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useExerciseLibraryStore = create<IExerciseLibraryState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
