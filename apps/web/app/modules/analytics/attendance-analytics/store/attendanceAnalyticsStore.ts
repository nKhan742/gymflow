import { create } from 'zustand';

interface IAttendanceAnalyticsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useAttendanceAnalyticsStore = create<IAttendanceAnalyticsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
