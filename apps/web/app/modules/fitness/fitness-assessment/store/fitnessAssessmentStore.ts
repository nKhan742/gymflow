import { create } from 'zustand';

interface IFitnessAssessmentState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useFitnessAssessmentStore = create<IFitnessAssessmentState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
