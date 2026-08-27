import { create } from 'zustand';

interface IDietPlansState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useDietPlansStore = create<IDietPlansState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
