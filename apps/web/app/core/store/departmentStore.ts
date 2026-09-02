import { create } from 'zustand';
import { STORAGE_KEYS } from '../constants/storageKeys';

export interface IDepartmentItem {
  id: string;
  _id?: string;
  name: string;
  code: string;
  category?: string;
  description?: string;
  branchName?: string;
  status?: string;
}

export interface IDepartmentOption {
  value: string;
  label: string;
  badge?: string;
}

interface IDepartmentStoreState {
  departments: IDepartmentItem[];
  departmentOptions: IDepartmentOption[];
  isLoading: boolean;
  loadDepartments: () => Promise<IDepartmentItem[]>;
}

export const useDepartmentStore = create<IDepartmentStoreState>((set) => ({
  departments: [],
  departmentOptions: [],
  isLoading: false,

  loadDepartments: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym/departments', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        const items: IDepartmentItem[] = json.data?.items || (Array.isArray(json.data) ? json.data : []);
        const options: IDepartmentOption[] = items.map((d) => ({
          value: d.name,
          label: d.name,
          badge: d.code || d.category || undefined,
        }));

        set({
          departments: items,
          departmentOptions: options,
          isLoading: false,
        });
        return items;
      }
    } catch {
      // handle network error
    } finally {
      set({ isLoading: false });
    }
    return [];
  },
}));
