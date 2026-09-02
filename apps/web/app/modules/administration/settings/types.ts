export interface ISystemSettingsModel {
  id?: string;
  _id?: string;
  // SaaS Profile
  orgName: string;
  legalBusinessName: string;
  taxIdGstNumber: string;
  logoUrl?: string;
  faviconUrl?: string;
  supportEmail: string;
  supportPhone: string;
  primaryCurrency: string;
  currencySymbol: string;
  timezone: string;
  
  // Security Policies
  requireMfaPolicy: boolean;
  sessionTimeoutMinutes: number;
  maxLoginAttempts: number;
  passwordExpiryDays: number;
  ipQuorumWhitelist: string;
  
  // Email & Notifications
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  senderDisplayName: string;
  webhookSecretKey: string;
  slackAlertWebhook: string;
  
  // Billing & Finance Rules
  defaultTaxRatePercent: number;
  gracePeriodDays: number;
  autoDebitRetryCount: number;
  maintenanceMode: boolean;
}

export interface ISettingsFilters {
  search?: string;
  category?: string;
}
