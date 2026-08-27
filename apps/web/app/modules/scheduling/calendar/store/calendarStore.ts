import { create } from 'zustand';

interface ICalendarState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useCalendarStore = create<ICalendarState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
