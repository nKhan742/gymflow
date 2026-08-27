import { create } from 'zustand';

interface IFinanceReportsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useFinanceReportsStore = create<IFinanceReportsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
