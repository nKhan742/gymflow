import { create } from 'zustand';

interface IBodyMeasurementsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useBodyMeasurementsStore = create<IBodyMeasurementsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
