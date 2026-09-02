export interface IReferral {
  id: string;
  _id?: string;
  referrerName: string;
  referrerEmail: string;
  referrerPhone: string;
  referrerAvatar?: string;
  referredProspectName: string;
  referredProspectEmail: string;
  referredProspectPhone: string;
  referredProspectAvatar?: string;
  referralCode: string;
  rewardType: 'CASH_CREDIT' | 'FREE_MONTH' | 'PT_SESSION_PACK' | 'VIP_SWAG_BOX';
  rewardValue: string;
  rewardStatus: 'PENDING_QUALIFICATION' | 'APPROVED_ISSUED' | 'REDEEMED' | 'EXPIRED';
  status: 'INVITED' | 'TOUR_BOOKED' | 'CONVERTED_MEMBER' | 'UNRESPONSIVE';
  branchId?: string;
  branchName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type IReferrals = IReferral;

export interface IReferralFilters {
  search?: string;
  status?: string;
  rewardStatus?: string;
  branchId?: string;
}
