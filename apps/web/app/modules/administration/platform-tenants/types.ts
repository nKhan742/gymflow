export type TenantPlanTier = 'ESSENTIAL' | 'PROFESSIONAL' | 'ENTERPRISE';
export type TenantBillingCycle = 'MONTHLY' | 'ANNUAL';
export type TenantSubscriptionStatus = 'ACTIVE' | 'PAUSED' | 'STOPPED';

export interface IGymTenant {
  id: string;
  gymName: string;
  campusName: string;
  ownerName: string;
  email: string;
  phone: string;
  password: string; // Plaintext visible for platform owner impersonation/login
  planTier: TenantPlanTier;
  billingCycle: TenantBillingCycle;
  subscriptionStatus: TenantSubscriptionStatus;
  memberCount: number;
  staffCount: number;
  branchCount: number;
  monthlyFee: number;
  joinedDate: string;
  nextBillingDate: string;
  databaseName: string;
}
