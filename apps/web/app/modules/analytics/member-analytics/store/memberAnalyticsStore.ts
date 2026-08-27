import { create } from 'zustand';

interface IMemberAnalyticsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useMemberAnalyticsStore = create<IMemberAnalyticsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
