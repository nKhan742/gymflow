import { create } from 'zustand';

interface IDashboardAnalyticsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useDashboardAnalyticsStore = create<IDashboardAnalyticsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
