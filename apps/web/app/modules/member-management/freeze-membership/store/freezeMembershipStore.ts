import { create } from 'zustand';

interface IFreezeMembershipState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useFreezeMembershipStore = create<IFreezeMembershipState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
