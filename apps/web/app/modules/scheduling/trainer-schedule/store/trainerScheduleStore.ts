import { create } from 'zustand';

interface ITrainerScheduleState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useTrainerScheduleStore = create<ITrainerScheduleState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
