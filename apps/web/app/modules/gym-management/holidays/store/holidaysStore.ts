import { create } from 'zustand';

interface IHolidaysState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useHolidaysStore = create<IHolidaysState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
