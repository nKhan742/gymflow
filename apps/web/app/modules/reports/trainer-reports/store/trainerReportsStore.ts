import { create } from 'zustand';

interface ITrainerReportsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useTrainerReportsStore = create<ITrainerReportsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
