import { create } from 'zustand';

interface IAdminDashboardState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useAdminDashboardStore = create<IAdminDashboardState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
