import { create } from 'zustand';

interface ITrainerCommissionState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useTrainerCommissionStore = create<ITrainerCommissionState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
