import { create } from 'zustand';

interface IReceptionDashboardState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useReceptionDashboardStore = create<IReceptionDashboardState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
