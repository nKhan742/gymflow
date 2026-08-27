import { create } from 'zustand';

interface IMembershipReportsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useMembershipReportsStore = create<IMembershipReportsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
