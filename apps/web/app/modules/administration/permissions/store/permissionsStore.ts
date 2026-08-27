import { create } from 'zustand';

interface IPermissionsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const usePermissionsStore = create<IPermissionsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
