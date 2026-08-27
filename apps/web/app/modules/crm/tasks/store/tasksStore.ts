import { create } from 'zustand';

interface ITasksState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useTasksStore = create<ITasksState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
