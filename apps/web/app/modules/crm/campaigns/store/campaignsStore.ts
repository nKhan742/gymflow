import { create } from 'zustand';

interface ICampaignsState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useCampaignsStore = create<ICampaignsState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
