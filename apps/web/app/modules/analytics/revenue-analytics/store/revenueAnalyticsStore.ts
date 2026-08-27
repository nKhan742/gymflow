import { create } from 'zustand';

interface IRevenueAnalyticsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useRevenueAnalyticsStore = create<IRevenueAnalyticsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
