import { create } from 'zustand';

interface IForgotPasswordState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useForgotPasswordStore = create<IForgotPasswordState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
