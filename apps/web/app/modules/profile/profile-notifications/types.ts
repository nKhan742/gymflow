export interface INotificationPreferenceModel {
  id: string;
  _id?: string;
  userEmail: string;
  userName: string;
  userAvatar?: string;
  inAppPushEnabled: boolean;
  emailDigestEnabled: boolean;
  emailCadence: 'INSTANT' | 'DAILY_DIGEST' | 'WEEKLY_SUMMARY' | 'DISABLED';
  smsUrgentAlertsEnabled: boolean;
  whatsappDispatchEnabled: boolean;
  turnstileSecurityAlerts: boolean;
  ptBookingReminders: boolean;
  invoicePaymentReceipts: boolean;
  emergencySosAlerts: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  enabledChannelsCount: number;
  status: 'ACTIVE' | 'PAUSED' | 'DO_NOT_DISTURB';
  branchId?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface INotificationPreferenceModelFilters {
  search?: string;
  emailCadence?: string;
  status?: string;
  branchId?: string;
}
