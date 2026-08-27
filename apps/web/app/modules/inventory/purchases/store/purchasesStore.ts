import { create } from 'zustand';

interface IPurchasesState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const usePurchasesStore = create<IPurchasesState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
