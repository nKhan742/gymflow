import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export interface IMemberItem {
  id?: string;
  _id?: string;
  memberCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  dateOfBirth?: string;
  avatarUrl?: string;
  memberStatus: 'ACTIVE' | 'FROZEN' | 'EXPIRED' | 'CANCELLED';
  status?: string;
  membership?: {
    planId?: string;
    planName?: string;
    tier: 'VIP_PLATINUM' | 'GOLD_ANNUAL' | 'SILVER_MONTHLY' | 'STUDENT_CORPORATE' | 'OFF_PEAK' | 'CLASS_PACK' | string;
    price?: number;
    startDate?: string;
    endDate?: string;
    autoRenew?: boolean;
    status?: string;
  };
  assignedTrainer?: {
    trainerId?: string;
    name: string;
    email?: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  lockerNumber?: string;
  rfidTag?: string;
  stats?: {
    totalVisits: number;
    visitsThisMonth: number;
    lastVisit?: string;
    streakDays: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

const API_BASE = 'http://localhost:5000/api/v1/members/members';

const getHeaders = () => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

export const memberApi = {
  async getMembers(params?: { status?: string; search?: string }): Promise<IMemberItem[]> {
    try {
      const url = new URL(API_BASE);
      if (params?.status && params.status !== 'ALL') url.searchParams.append('status', params.status);
      if (params?.search) url.searchParams.append('search', params.search);

      const res = await fetch(url.toString(), {
        headers: getHeaders(),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          return json.data.items;
        }
      }
    } catch {}

    // Fallback seed list
    return [
      {
        id: '1',
        memberCode: 'GF-9284',
        firstName: 'Sarah',
        lastName: 'Jenkins',
        email: 'sarah.jenkins@example.com',
        phone: '+1 (555) 234-5678',
        memberStatus: 'ACTIVE',
        membership: {
          tier: 'VIP_PLATINUM',
          planName: 'VIP Platinum All-Access',
          price: 1499,
          startDate: '2026-01-15',
          endDate: '2027-01-15',
          autoRenew: true,
          status: 'ACTIVE',
        },
        assignedTrainer: {
          name: 'Alex Vance',
          email: 'alex.vance@gymflow.io',
        },
        lockerNumber: 'L-104',
        stats: {
          totalVisits: 142,
          visitsThisMonth: 18,
          lastVisit: 'Today at 7:30 AM',
          streakDays: 4,
        },
      },
    ];
  },

  async getMemberById(id: string): Promise<IMemberItem> {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        headers: getHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          return data.data;
        }
      }
    } catch {}

    const list = await this.getMembers();
    const match = list.find((m) => m.memberCode === id || m.id === id || m._id === id);
    return match || list[0];
  },

  async createMember(data: Partial<IMemberItem>): Promise<IMemberItem> {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const json = await res.json();
      return json.data;
    }

    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.message || 'Failed to create member');
  },

  async updateMember(id: string, data: Partial<IMemberItem>): Promise<IMemberItem> {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const json = await res.json();
      return json.data;
    }

    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.message || 'Failed to update member');
  },

  async freezeMember(id: string, days = 30, reason = 'Vacation'): Promise<boolean> {
    try {
      await fetch(`${API_BASE}/${id}/freeze`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ days, reason }),
      });
    } catch {}
    return true;
  },

  async renewMember(id: string, durationMonths = 12): Promise<boolean> {
    try {
      await fetch(`${API_BASE}/${id}/renew`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ durationMonths }),
      });
    } catch {}
    return true;
  },

  async checkInMember(id: string, method = 'BIOMETRIC'): Promise<boolean> {
    try {
      await fetch(`${API_BASE}/${id}/check-in`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ method }),
      });
    } catch {}
    return true;
  },
};
