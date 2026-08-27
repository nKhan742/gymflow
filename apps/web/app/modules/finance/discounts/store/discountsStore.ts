import { create } from 'zustand';

interface IDiscountsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useDiscountsStore = create<IDiscountsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
