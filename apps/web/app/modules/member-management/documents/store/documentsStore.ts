import { create } from 'zustand';

interface IDocumentsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useDocumentsStore = create<IDocumentsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
