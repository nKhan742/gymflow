import { create } from 'zustand';

interface IRevenueReportsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useRevenueReportsStore = create<IRevenueReportsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
