import { create } from 'zustand';

interface IProgressState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useProgressStore = create<IProgressState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
