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

export const DEFAULT_BRANCHES: IBranchItem[] = [
  {
    id: '6a97eeff54ea155f8cc023cb',
    _id: '6a97eeff54ea155f8cc023cb',
    code: 'BR-274',
    name: 'Main Facility',
    tagline: 'Flagship Headquarters & Performance Center',
    phone: '',
    email: '',
    address: {
      street: '100 Main Facility Boulevard',
      city: 'New Delhi',
      country: 'India',
    },
    status: 'active',
  },
];

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
  const cached = localStorage.getItem('gymflow_live_branches');
  const customRaw = localStorage.getItem('gymflow_custom_gym_branches');
  const initialBranches: IBranchItem[] = cached
    ? JSON.parse(cached)
    : customRaw
    ? JSON.parse(customRaw)
    : DEFAULT_BRANCHES;

  const savedActive = localStorage.getItem('gymflow_active_branch');
  const initialActiveId =
    savedActive ||
    (initialBranches.length > 0 ? (initialBranches[0].id || initialBranches[0]._id || 'ALL') : 'ALL');

  return {
    activeBranchId: initialActiveId,
    branches: initialBranches,
    branchOptions: initialBranches.map((b) => ({
      value: b.name,
      label: `🏢 ${b.name}`,
    })),

    setActiveBranchId: (id: string) => {
      localStorage.setItem('gymflow_active_branch', id);
      set({ activeBranchId: id });
    },

    getActiveBranch: () => {
      const { activeBranchId, branches } = get();
      if (!activeBranchId || activeBranchId === 'ALL') {
        return branches[0] || null;
      }
      return (
        branches.find(
          (b) =>
            b.id === activeBranchId ||
            b._id === activeBranchId ||
            b.name?.toLowerCase() === activeBranchId.toLowerCase()
        ) ||
        branches[0] ||
        null
      );
    },

    loadBranches: async () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (!token) return;

        const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym/branches', {
          headers: {
            Authorization: `Bearer ${token}`,
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

          if (loadedBranches.length > 0) {
            localStorage.setItem('gymflow_live_branches', JSON.stringify(loadedBranches));
            localStorage.removeItem('gymflow_custom_gym_branches');

            const currentActive = get().activeBranchId;
            const branchExists = loadedBranches.some(
              (b) => b.id === currentActive || b._id === currentActive || b.name === currentActive
            );
            const nextActive = branchExists
              ? currentActive
              : (loadedBranches[0].id || loadedBranches[0]._id || 'ALL');

            localStorage.setItem('gymflow_active_branch', nextActive);

            set({
              activeBranchId: nextActive,
              branches: loadedBranches,
              branchOptions: loadedBranches.map((b) => ({
                value: b.name,
                label: `🏢 ${b.name}`,
              })),
            });
          }
        }
      } catch {}
    },
  };
});
