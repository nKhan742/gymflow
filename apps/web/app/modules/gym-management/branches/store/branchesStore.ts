import { create } from 'zustand';

interface IBranchesState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useBranchesStore = create<IBranchesState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
