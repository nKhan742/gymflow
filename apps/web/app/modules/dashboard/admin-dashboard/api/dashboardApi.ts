import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export interface IDashboardStats {
  totalMembers: number;
  activeMembers: number;
  monthlyRevenue: number;
  totalClasses: number;
  totalLeads: number;
  currentOccupancy: number;
  maxCapacity?: number;
  growthRate: string;
  retentionRate: string;
  todayCheckins: number;
  recentMembers?: Array<{
    id: string;
    memberCode: string;
    name: string;
    plan: string;
    tier: string;
    status: string;
    avatar: string;
    email: string;
    createdAt?: string;
  }>;
  facilities?: Array<{
    name: string;
    currentOccupancy: number;
    capacity: number;
    type: string;
    status: string;
  }>;
}

const API_BASE = 'https://gymflow-api-2jdh.onrender.com/api/v1/dashboard/admin-dashboard';

const getHeaders = () => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

export const dashboardApi = {
  async getExecutiveStats(): Promise<IDashboardStats> {
    try {
      const res = await fetch(`${API_BASE}/stats`, { headers: getHeaders() });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch {}

    return {
      totalMembers: 0,
      activeMembers: 0,
      monthlyRevenue: 0,
      totalClasses: 0,
      totalLeads: 0,
      currentOccupancy: 0,
      maxCapacity: 0,
      growthRate: '0%',
      retentionRate: '0%',
      todayCheckins: 0,
      recentMembers: [],
      facilities: [],
    };
  },

  async getRevenueAnalytics() {
    try {
      const res = await fetch(`${API_BASE}/revenue-analytics`, { headers: getHeaders() });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch {}

    return [];
  },

  async getHourlyAttendance() {
    try {
      const res = await fetch(`${API_BASE}/hourly-attendance`, { headers: getHeaders() });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch {}

    return [];
  },
};
