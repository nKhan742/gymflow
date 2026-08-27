import { create } from 'zustand';

interface IWorkingHoursState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useWorkingHoursStore = create<IWorkingHoursState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
