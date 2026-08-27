import { create } from 'zustand';

interface ITrainerDashboardState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useTrainerDashboardStore = create<ITrainerDashboardState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
