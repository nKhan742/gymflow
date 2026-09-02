export interface ITask {
  id: string;
  _id?: string;
  title: string;
  taskType: 'LEAD_OUTREACH' | 'MEMBER_RETENTION' | 'EQUIPMENT_AUDIT' | 'CONTRACT_RENEWAL' | 'VIP_CONCIERGE';
  assignedTo: string;
  assignedAvatar?: string;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate: string;
  dueTime: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  branchId?: string;
  branchName?: string;
  checklist?: Array<{ id: string; text: string; done: boolean }>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ITasks = ITask;

export interface ITaskFilters {
  search?: string;
  status?: string;
  taskType?: string;
  priority?: string;
  branchId?: string;
}
