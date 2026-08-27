import { create } from 'zustand';

interface IStaffState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useStaffStore = create<IStaffState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
