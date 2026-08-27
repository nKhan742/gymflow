import { create } from 'zustand';

interface IMembershipRenewalsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useMembershipRenewalsStore = create<IMembershipRenewalsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
