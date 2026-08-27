import { create } from 'zustand';

interface IAppointmentsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useAppointmentsStore = create<IAppointmentsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
