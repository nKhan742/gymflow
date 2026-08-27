import { create } from 'zustand';

interface IDepartmentsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useDepartmentsStore = create<IDepartmentsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
