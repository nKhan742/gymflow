export interface ICampaign {
  id: string;
  _id?: string;
  name: string;
  code: string;
  bannerUrl?: string;
  channel: 'META_ADS' | 'GOOGLE_SEARCH' | 'WHATSAPP_BROADCAST' | 'EMAIL_NEWSLETTER' | 'IN_GYM_PROMO' | 'INFLUENCER_PARTNER';
  targetAudience: string;
  budgetTotal: number;
  spendToDate: number;
  startDate: string;
  endDate: string;
  leadsGenerated: number;
  conversionsCount: number;
  status: 'ACTIVE' | 'SCHEDULED' | 'PAUSED' | 'COMPLETED';
  branchId?: string;
  branchName?: string;
  discountOffer?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ICampaigns = ICampaign;

export interface ICampaignFilters {
  search?: string;
  channel?: string;
  status?: string;
  branchId?: string;
}
