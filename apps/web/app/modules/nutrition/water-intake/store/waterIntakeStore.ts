import { create } from 'zustand';

interface IWaterIntakeState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useWaterIntakeStore = create<IWaterIntakeState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
