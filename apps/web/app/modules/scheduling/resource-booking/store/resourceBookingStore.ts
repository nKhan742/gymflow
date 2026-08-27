import { create } from 'zustand';

interface IResourceBookingState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useResourceBookingStore = create<IResourceBookingState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
