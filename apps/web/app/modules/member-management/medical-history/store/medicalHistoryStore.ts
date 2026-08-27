import { create } from 'zustand';

interface IMedicalHistoryState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useMedicalHistoryStore = create<IMedicalHistoryState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
