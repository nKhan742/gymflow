export interface IFollowUp {
  id: string;
  _id?: string;
  contactName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  channel: 'PHONE_CALL' | 'WHATSAPP' | 'SMS_TEXT' | 'EMAIL' | 'IN_PERSON_DESK';
  scheduledDate: string;
  scheduledTime: string;
  priority: 'URGENT' | 'NORMAL' | 'LOW';
  assignedRep: string;
  branchId?: string;
  branchName?: string;
  outcome: 'PENDING' | 'CONNECTED_SCHEDULED' | 'VOICEMAIL_LEFT' | 'NO_ANSWER' | 'WON_CONVERTED' | 'NOT_INTERESTED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type IFollowUps = IFollowUp;

export interface IFollowUpFilters {
  search?: string;
  channel?: string;
  outcome?: string;
  priority?: string;
  branchId?: string;
}
