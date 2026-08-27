import { create } from 'zustand';

interface IInventoryReportsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useInventoryReportsStore = create<IInventoryReportsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
