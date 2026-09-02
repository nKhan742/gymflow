export interface ISmsBlast {
  id: string;
  _id?: string;
  campaignTitle: string;
  smsText: string;
  senderId: string;
  gatewayProvider: 'TWILIO' | 'AWS_SNS' | 'VONAGE' | 'INFOBIP' | 'SINCH';
  targetAudience: 'ALL_MEMBERS' | 'OVERDUE_PAYMENT' | 'CLASS_REMINDER' | 'VIP_TIER' | 'INACTIVE_30_DAYS';
  status: 'DELIVERED' | 'QUEUED' | 'FAILED' | 'PARTIAL';
  recipientsCount: number;
  deliveredCount: number;
  characterCount: number;
  smsSegments: number;
  estimatedCost: number;
  scheduledAt: string;
  branchId?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISmsBlastFilters {
  search?: string;
  gatewayProvider?: string;
  targetAudience?: string;
  status?: string;
  branchId?: string;
}
