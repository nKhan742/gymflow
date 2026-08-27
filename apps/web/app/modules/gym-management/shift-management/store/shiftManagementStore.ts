import { create } from 'zustand';

interface IShiftManagementState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useShiftManagementStore = create<IShiftManagementState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
