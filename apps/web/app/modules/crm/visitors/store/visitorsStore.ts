import { create } from 'zustand';

interface IVisitorsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useVisitorsStore = create<IVisitorsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
