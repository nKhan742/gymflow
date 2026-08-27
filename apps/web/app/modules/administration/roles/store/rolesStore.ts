import { create } from 'zustand';

interface IRolesState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useRolesStore = create<IRolesState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
