import { create } from 'zustand';
import { STORAGE_KEYS } from '../constants/storageKeys';

interface IAppState {
  sidebarOpen: boolean;
  activeBranchId: string | null;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveBranchId: (branchId: string) => void;
}

export const useAppStore = create<IAppState>((set) => ({
  sidebarOpen: true,
  activeBranchId: localStorage.getItem(STORAGE_KEYS.ACTIVE_BRANCH) || 'branch-main',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveBranchId: (branchId) => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_BRANCH, branchId);
    set({ activeBranchId: branchId });
  },
}));
