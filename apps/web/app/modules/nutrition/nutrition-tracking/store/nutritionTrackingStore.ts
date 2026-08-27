import { create } from 'zustand';

interface INutritionTrackingState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useNutritionTrackingStore = create<INutritionTrackingState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
