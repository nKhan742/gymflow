import { create } from 'zustand';

interface IMembershipPlansState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useMembershipPlansStore = create<IMembershipPlansState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
