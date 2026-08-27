import { create } from 'zustand';

interface IServiceHistoryState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useServiceHistoryStore = create<IServiceHistoryState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
