import { create } from 'zustand';

interface IAuditLogsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useAuditLogsStore = create<IAuditLogsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
