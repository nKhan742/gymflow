import { create } from 'zustand';

interface IMaintenanceState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useMaintenanceStore = create<IMaintenanceState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
