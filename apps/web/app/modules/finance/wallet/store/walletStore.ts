import { create } from 'zustand';

interface IWalletState {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const useWalletStore = create<IWalletState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
