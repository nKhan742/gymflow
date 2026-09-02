export interface IEmailCampaign {
  id: string;
  _id?: string;
  campaignName: string;
  subjectLine: string;
  previewText: string;
  senderName: string;
  senderEmail: string;
  bannerPhoto?: string;
  segment: 'ALL_ACTIVE_MEMBERS' | 'EXPIRED_CHURNED_LEADS' | 'VIP_BLACK_CARD' | 'PERSONAL_TRAINING_CLIENTS' | 'NEW_SIGNUPS_30_DAYS';
  templateType: 'NEWSLETTER' | 'MEMBERSHIP_RENEWAL' | 'PROMOTIONAL_OFFER' | 'EVENT_INVITE' | 'WELCOME_SERIES';
  status: 'SENT' | 'SCHEDULED' | 'DRAFT' | 'SENDING';
  sentCount: number;
  deliveredCount: number;
  openRate: number;
  clickRate: number;
  scheduledDate: string;
  htmlBody: string;
  branchId?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IEmailCampaignFilters {
  search?: string;
  segment?: string;
  templateType?: string;
  status?: string;
  branchId?: string;
}
