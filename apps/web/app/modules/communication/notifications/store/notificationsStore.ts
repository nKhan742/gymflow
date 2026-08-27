import { create } from 'zustand';

interface INotificationsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useNotificationsStore = create<INotificationsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
