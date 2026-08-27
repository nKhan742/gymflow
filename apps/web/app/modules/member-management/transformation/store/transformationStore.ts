import { create } from 'zustand';

interface ITransformationState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useTransformationStore = create<ITransformationState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
