import { StatusType } from '../../../../database/base.model.js';
import { IMemberMembership, IMemberTrainer, IMemberEmergencyContact, IMemberStats } from '../model/members.model.js';

export interface IMembers {
  id: string;
  tenantId: string;
  branchId?: string;
  memberCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  membership: IMemberMembership;
  assignedTrainer?: IMemberTrainer;
  emergencyContact?: IMemberEmergencyContact;
  status: StatusType;
  memberStatus: 'ACTIVE' | 'EXPIRED' | 'FROZEN' | 'OVERDUE' | 'PENDING';
  stats: IMemberStats;
  createdAt: Date;
  updatedAt: Date;
}
