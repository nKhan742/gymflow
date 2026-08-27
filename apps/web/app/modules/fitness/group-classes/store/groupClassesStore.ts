import { create } from 'zustand';

interface IGroupClassesState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useGroupClassesStore = create<IGroupClassesState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
