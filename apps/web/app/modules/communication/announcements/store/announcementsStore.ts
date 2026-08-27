import { create } from 'zustand';

interface IAnnouncementsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useAnnouncementsStore = create<IAnnouncementsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
