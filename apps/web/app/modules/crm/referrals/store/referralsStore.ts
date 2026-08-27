import { create } from 'zustand';

interface IReferralsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useReferralsStore = create<IReferralsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
