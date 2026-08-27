import { create } from 'zustand';

interface IPaymentsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const usePaymentsStore = create<IPaymentsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
