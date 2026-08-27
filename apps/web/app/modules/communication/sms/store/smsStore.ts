import { create } from 'zustand';

interface ISmsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useSmsStore = create<ISmsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
