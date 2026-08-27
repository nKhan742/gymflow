import { create } from 'zustand';

interface ILeadsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useLeadsStore = create<ILeadsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
