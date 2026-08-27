import { create } from 'zustand';

interface IPosState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const usePosStore = create<IPosState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
