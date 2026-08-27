import { create } from 'zustand';

interface IWorkoutPlansState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useWorkoutPlansStore = create<IWorkoutPlansState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
