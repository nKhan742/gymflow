import { create } from 'zustand';

interface IMemberDashboardState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useMemberDashboardStore = create<IMemberDashboardState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
