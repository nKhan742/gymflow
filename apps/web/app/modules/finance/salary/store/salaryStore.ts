import { create } from 'zustand';

interface ISalaryState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useSalaryStore = create<ISalaryState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
