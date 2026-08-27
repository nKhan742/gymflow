export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  MEMBERS: {
    BASE: '/members',
    STATS: '/members/stats',
  },
  TRAINERS: {
    BASE: '/trainers',
  },
  ATTENDANCE: {
    BASE: '/attendance',
    CHECKIN: '/attendance/checkin',
  },
  INVOICES: {
    BASE: '/invoices',
  },
  DASHBOARD: {
    STATS: '/dashboard/metrics',
  },
} as const;
