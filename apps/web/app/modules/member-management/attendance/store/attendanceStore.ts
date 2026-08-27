import { create } from 'zustand';

interface IAttendanceState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useAttendanceStore = create<IAttendanceState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
