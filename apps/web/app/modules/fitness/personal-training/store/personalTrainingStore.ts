import { create } from 'zustand';

interface IPersonalTrainingState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const usePersonalTrainingStore = create<IPersonalTrainingState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
