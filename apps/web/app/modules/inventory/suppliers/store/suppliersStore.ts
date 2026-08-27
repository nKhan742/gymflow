import { create } from 'zustand';

interface ISuppliersState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useSuppliersStore = create<ISuppliersState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
