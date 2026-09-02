export interface ILead {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  source: 'WEBSITE' | 'WALK_IN' | 'INSTAGRAM' | 'FACEBOOK_META' | 'GOOGLE_ADS' | 'MEMBER_REFERRAL' | 'TIKTOK_EVENT';
  stage: 'NEW_INQUIRY' | 'CONTACTED' | 'TOUR_SCHEDULED' | 'VIP_TRIAL_ACTIVE' | 'NEGOTIATION' | 'WON_MEMBER' | 'LOST_CLOSED';
  priority: 'HOT' | 'WARM' | 'COLD';
  fitnessGoal: 'WEIGHT_LOSS' | 'HYPERTROPHY_BULKING' | 'CARDIO_ENDURANCE' | 'POWERLIFTING' | 'REHAB_POSTURE' | 'GENERAL_WELLNESS';
  targetBudgetMonthly: number;
  estimatedLtv: number;
  preferredTimeSlot: 'EARLY_MORNING' | 'MID_DAY' | 'EVENING_PEAK' | 'NIGHT_OWL' | 'WEEKENDS_ONLY';
  assignedAgent: string;
  branchId?: string;
  branchName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ILeads = ILead;

export interface ILeadFilters {
  search?: string;
  stage?: string;
  priority?: string;
  source?: string;
  branchId?: string;
}
