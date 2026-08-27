import { create } from 'zustand';

interface IWhatsappState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useWhatsappStore = create<IWhatsappState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
