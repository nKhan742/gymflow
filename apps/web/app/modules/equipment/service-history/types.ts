export interface IServiceLog {
  id: string;
  _id?: string;
  logNumber: string;
  equipmentId?: string;
  equipmentName: string;
  assetTag: string;
  category: 'CARDIO' | 'STRENGTH' | 'FREE_WEIGHTS' | 'RECOVERY_SPA' | 'ACCESSORIES' | 'FUNCTIONAL_TURF';
  zoneName: string;
  photoUrl?: string;
  serviceDate: string;
  serviceType: 'QUARTERLY_INSPECTION' | 'MAJOR_OVERHAUL' | 'EMERGENCY_REPAIR' | 'CABLE_LUBE' | 'WARRANTY_REPLACEMENT';
  technicianName: string;
  technicianAvatar?: string;
  serviceProvider: string;
  partsReplaced: string[];
  downtimeHours: number;
  totalCost: number;
  invoiceNumber?: string;
  conditionAfterService: 'EXCELLENT' | 'GOOD' | 'FAIR';
  technicianNotes?: string;
  warrantyClaimed: boolean;
  branchId?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
}

export type IServiceHistory = IServiceLog;

export interface IServiceHistoryFilters {
  search?: string;
  serviceType?: string;
  conditionAfterService?: string;
  branchId?: string;
}
