import { create } from 'zustand';

interface IFollowUpsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useFollowUpsStore = create<IFollowUpsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
