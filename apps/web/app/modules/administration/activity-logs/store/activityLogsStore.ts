import { create } from 'zustand';

interface IActivityLogsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useActivityLogsStore = create<IActivityLogsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
