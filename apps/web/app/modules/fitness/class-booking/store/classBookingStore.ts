import { create } from 'zustand';

interface IClassBookingState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useClassBookingStore = create<IClassBookingState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
