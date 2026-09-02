export interface INotification {
  id: string;
  _id?: string;
  title: string;
  message: string;
  bannerPhoto?: string;
  category: 'BILLING' | 'CLASS_REMINDER' | 'EQUIPMENT_ALERT' | 'SECURITY_TURNSTILE' | 'PROMOTION' | 'SYSTEM';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  targetAudience: 'ALL_MEMBERS' | 'VIP_MEMBERS' | 'TRAINERS_STAFF' | 'OVERDUE_MEMBERS';
  channel: 'IN_APP_PUSH' | 'MOBILE_POPUP' | 'SOUND_CHIME';
  deliveryStatus: 'SENT' | 'SCHEDULED' | 'FAILED' | 'DRAFT';
  readCount: number;
  totalRecipients: number;
  scheduledFor: string;
  authorName: string;
  authorAvatar?: string;
  branchId?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface INotificationFilters {
  search?: string;
  category?: string;
  priority?: string;
  deliveryStatus?: string;
  targetAudience?: string;
  branchId?: string;
}
