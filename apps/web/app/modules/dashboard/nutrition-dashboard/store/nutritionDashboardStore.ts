import { create } from 'zustand';

interface INutritionDashboardState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useNutritionDashboardStore = create<INutritionDashboardState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
