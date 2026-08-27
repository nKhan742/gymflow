import { create } from 'zustand';

interface IProductsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useProductsStore = create<IProductsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
