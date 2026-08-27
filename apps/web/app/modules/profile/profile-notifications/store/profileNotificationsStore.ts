import { create } from 'zustand';

interface IProfileNotificationsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useProfileNotificationsStore = create<IProfileNotificationsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
