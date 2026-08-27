import { create } from 'zustand';

interface IEquipmentListState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useEquipmentListStore = create<IEquipmentListState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
