import { create } from 'zustand';

interface ITrialMembersState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useTrialMembersStore = create<ITrialMembersState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
