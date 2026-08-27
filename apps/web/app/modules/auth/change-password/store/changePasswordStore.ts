import { create } from 'zustand';

interface IChangePasswordState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useChangePasswordStore = create<IChangePasswordState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
