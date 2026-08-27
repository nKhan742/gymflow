import { create } from 'zustand';

interface IAttendanceReportsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useAttendanceReportsStore = create<IAttendanceReportsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
