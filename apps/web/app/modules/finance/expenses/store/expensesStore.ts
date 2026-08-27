import { create } from 'zustand';

interface IExpensesState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useExpensesStore = create<IExpensesState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
