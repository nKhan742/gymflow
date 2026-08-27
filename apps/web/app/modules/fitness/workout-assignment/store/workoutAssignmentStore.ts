import { create } from 'zustand';

interface IWorkoutAssignmentState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useWorkoutAssignmentStore = create<IWorkoutAssignmentState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
