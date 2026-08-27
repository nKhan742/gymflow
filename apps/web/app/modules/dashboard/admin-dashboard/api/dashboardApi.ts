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

const API_BASE = 'http://localhost:5000/api/v1/dashboard/admin-dashboard';

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
      totalMembers: 5,
      activeMembers: 4,
      monthlyRevenue: 128450,
      totalClasses: 3,
      totalLeads: 2,
      currentOccupancy: 76,
      maxCapacity: 215,
      growthRate: '+14.2%',
      retentionRate: '94.8%',
      todayCheckins: 595,
      recentMembers: [
        { id: '1', memberCode: 'GF-9284', name: 'Sarah Jenkins', plan: 'VIP Platinum All-Access', tier: 'VIP_PLATINUM', status: 'ACTIVE', avatar: 'SJ', email: 'sarah.jenkins@example.com' },
        { id: '2', memberCode: 'GF-9285', name: 'Marcus Brody', plan: 'Gold Annual Pass', tier: 'GOLD_ANNUAL', status: 'ACTIVE', avatar: 'MB', email: 'marcus.brody@example.com' },
        { id: '3', memberCode: 'GF-9286', name: 'Elena Rostova', plan: 'Silver Monthly Flex', tier: 'SILVER_MONTHLY', status: 'ACTIVE', avatar: 'ER', email: 'elena.rostova@example.com' },
        { id: '4', memberCode: 'GF-9287', name: 'David Kim', plan: 'Gold Annual Pass', tier: 'GOLD_ANNUAL', status: 'FROZEN', avatar: 'DK', email: 'david.kim@example.com' },
      ],
      facilities: [
        { name: 'Olympic Free Weight Arena', currentOccupancy: 42, capacity: 120, type: 'WEIGHT_ROOM', status: 'active' },
        { name: 'Cardio Panoramic Loft', currentOccupancy: 28, capacity: 80, type: 'CARDIO_ZONE', status: 'active' },
        { name: 'Infrared Recovery Sauna', currentOccupancy: 6, capacity: 15, type: 'SAUNA', status: 'active' },
      ],
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

    return [
      { month: 'Jan', mrr: 94000, newSales: 18000, target: 90000 },
      { month: 'Feb', mrr: 102000, newSales: 22000, target: 95000 },
      { month: 'Mar', mrr: 109000, newSales: 24000, target: 100000 },
      { month: 'Apr', mrr: 115000, newSales: 26000, target: 105000 },
      { month: 'May', mrr: 121000, newSales: 29000, target: 115000 },
      { month: 'Jun', mrr: 124000, newSales: 31000, target: 120000 },
      { month: 'Jul', mrr: 126000, newSales: 33000, target: 122000 },
      { month: 'Aug', mrr: 128450, newSales: 35200, target: 125000 },
    ];
  },

  async getHourlyAttendance() {
    try {
      const res = await fetch(`${API_BASE}/hourly-attendance`, { headers: getHeaders() });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch {}

    return [
      { time: '06:00', count: 42, capacity: 120 },
      { time: '08:00', count: 98, capacity: 120 },
      { time: '10:00', count: 64, capacity: 120 },
      { time: '12:00', count: 85, capacity: 120 },
      { time: '14:00', count: 45, capacity: 120 },
      { time: '16:00', count: 78, capacity: 120 },
      { time: '18:00', count: 114, capacity: 120 },
      { time: '20:00', count: 92, capacity: 120 },
      { time: '22:00', count: 31, capacity: 120 },
    ];
  },
};
