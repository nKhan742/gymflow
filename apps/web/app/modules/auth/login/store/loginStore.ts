import { create } from 'zustand';

interface ILoginState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useLoginStore = create<ILoginState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
