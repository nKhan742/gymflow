import { create } from 'zustand';

interface IAccountantDashboardState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useAccountantDashboardStore = create<IAccountantDashboardState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
