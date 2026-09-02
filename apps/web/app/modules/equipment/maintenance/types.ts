export interface IMaintenanceChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface IMaintenanceTicket {
  id: string;
  _id?: string;
  ticketNumber: string;
  equipmentId?: string;
  equipmentName: string;
  assetTag: string;
  category: 'CARDIO' | 'STRENGTH' | 'FREE_WEIGHTS' | 'RECOVERY_SPA' | 'ACCESSORIES' | 'FUNCTIONAL_TURF';
  zoneName: string;
  photoUrl?: string;
  issueTitle: string;
  maintenanceType: 'PREVENTIVE_INSPECTION' | 'EMERGENCY_REPAIR' | 'CALIBRATION' | 'PART_REPLACEMENT';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN_SCHEDULED' | 'IN_PROGRESS' | 'AWAITING_PARTS' | 'RESOLVED_TESTED' | 'CANCELED';
  assignedTechnician: string;
  technicianAvatar?: string;
  scheduledDate: string;
  estimatedCost: number;
  actualCost?: number;
  checklist: IMaintenanceChecklistItem[];
  resolutionNotes?: string;
  branchId?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
}

export type IMaintenance = IMaintenanceTicket;

export interface IMaintenanceFilters {
  search?: string;
  maintenanceType?: string;
  priority?: string;
  status?: string;
  branchId?: string;
}
