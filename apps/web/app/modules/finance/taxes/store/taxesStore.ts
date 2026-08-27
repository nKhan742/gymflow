import { create } from 'zustand';

interface ITaxesState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useTaxesStore = create<ITaxesState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
