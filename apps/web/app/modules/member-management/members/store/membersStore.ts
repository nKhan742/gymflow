import { create } from 'zustand';

interface IMembersState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useMembersStore = create<IMembersState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
