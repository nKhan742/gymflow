import { create } from 'zustand';

interface IEmergencyContactsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useEmergencyContactsStore = create<IEmergencyContactsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
