import { create } from 'zustand';

interface ISystemConfigurationState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useSystemConfigurationStore = create<ISystemConfigurationState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
