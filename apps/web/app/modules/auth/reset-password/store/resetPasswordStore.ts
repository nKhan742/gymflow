import { create } from 'zustand';

interface IResetPasswordState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useResetPasswordStore = create<IResetPasswordState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
