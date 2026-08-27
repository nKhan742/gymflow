import { create } from 'zustand';

interface IUsersState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useUsersStore = create<IUsersState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
