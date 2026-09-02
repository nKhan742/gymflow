export interface IHolidays {
  id?: string;
  tenantId?: string;
  name: string;
  code?: string;
  startDate: string;
  endDate: string;
  category: 'NATIONAL' | 'MAINTENANCE' | 'SPECIAL_EVENT' | 'EMERGENCY';
  operationalMode: 'CLOSED' | 'REDUCED_HOURS' | 'SELF_SERVICE';
  reducedHoursSchedule?: string;
  classPolicy: 'AUTO_CANCEL' | 'RESCHEDULE' | 'KEEP_SCHEDULED';
  ptPolicy: 'AUTO_CANCEL' | 'PERMITTED';
  branchId?: string;
  branchName?: string;
  memberBroadcast: boolean;
  status: 'active' | 'archived';
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}
