import { create } from 'zustand';

interface IInvoicesState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useInvoicesStore = create<IInvoicesState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
