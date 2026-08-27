import { create } from 'zustand';

interface IEmailState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useEmailStore = create<IEmailState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
