import { create } from 'zustand';
import { STORAGE_KEYS } from '../constants/storageKeys';

export interface IBranchItem {
  id: string;
  _id?: string;
  code: string;
  name: string;
  tagline?: string;
  image?: string;
  phone?: string;
  email?: string;
  sqFt?: number;
  capacity?: number;
  currentOccupancy?: number;
  memberCount?: number;
  staffCount?: number;
  turnstileCount?: number;
  monthlyRevenue?: number;
  address?: {
    street?: string;
    suite?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  manager?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  operatingHours?: {
    weekdays?: string;
    saturday?: string;
    sunday?: string;
  };
  amenities?: string[];
  status?: string;
}

export const DEFAULT_BRANCHES: IBranchItem[] = [];

export interface IBranchOption {
  value: string;
  label: string;
}

export interface IBranchState {
  activeBranchId: string; // 'ALL' or branch ID
  branches: IBranchItem[];
  branchOptions: IBranchOption[];
  setActiveBranchId: (id: string) => void;
  getActiveBranch: () => IBranchItem | null;
  loadBranches: () => Promise<void>;
}

export const useBranchStore = create<IBranchState>((set, get) => {
  const customRaw = localStorage.getItem('gymflow_custom_gym_branches');
  const initialBranches: IBranchItem[] = customRaw ? JSON.parse(customRaw) : [];

  return {
    activeBranchId: localStorage.getItem('gymflow_active_branch') || 'ALL',
    branches: initialBranches,
    branchOptions: initialBranches.map((b) => ({
      value: b.id || b._id || '',
      label: `🏢 ${b.name}`,
    })),

    setActiveBranchId: (id: string) => {
      localStorage.setItem('gymflow_active_branch', id);
      set({ activeBranchId: id });
    },

    getActiveBranch: () => {
      const { activeBranchId, branches } = get();
      if (activeBranchId === 'ALL') return null;
      return branches.find((b) => b.id === activeBranchId || b._id === activeBranchId) || null;
    },

    loadBranches: async () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym/branches', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          const json = await res.json();
          let loadedBranches: IBranchItem[] = [];
          if (json.success && Array.isArray(json.data)) {
            loadedBranches = json.data;
          } else if (json.data?.items) {
            loadedBranches = json.data.items;
          }

          const localRaw = localStorage.getItem('gymflow_custom_gym_branches');
          const localCustom: IBranchItem[] = localRaw ? JSON.parse(localRaw) : [];
          const allBranches = [...localCustom, ...loadedBranches];

          set({
            branches: allBranches,
            branchOptions: allBranches.map((b) => ({
              value: b.id || b._id || '',
              label: `🏢 ${b.name}`,
            })),
          });
        }
      } catch {}
    },
  };
});
