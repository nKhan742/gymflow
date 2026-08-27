import { create } from 'zustand';

interface IWorkoutTemplatesState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useWorkoutTemplatesStore = create<IWorkoutTemplatesState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
