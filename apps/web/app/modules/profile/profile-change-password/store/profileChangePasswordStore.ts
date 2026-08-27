import { create } from 'zustand';

interface IProfileChangePasswordState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useProfileChangePasswordStore = create<IProfileChangePasswordState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
