import { create } from 'zustand';

interface IStockAdjustmentState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useStockAdjustmentStore = create<IStockAdjustmentState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
