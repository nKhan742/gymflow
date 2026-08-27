import { create } from 'zustand';

interface ITrainerAnalyticsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useTrainerAnalyticsStore = create<ITrainerAnalyticsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
