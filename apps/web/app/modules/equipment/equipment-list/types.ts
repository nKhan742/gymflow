export interface IEquipment {
  id: string;
  _id?: string;
  name: string;
  assetTag: string;
  category: 'CARDIO' | 'STRENGTH' | 'FREE_WEIGHTS' | 'RECOVERY_SPA' | 'ACCESSORIES' | 'FUNCTIONAL_TURF';
  brand: string;
  model: string;
  serialNumber: string;
  photoUrl?: string;
  purchaseDate: string;
  purchasePrice: number;
  warrantyExpiry: string;
  status: 'OPERATIONAL' | 'MAINTENANCE_REQUIRED' | 'OUT_OF_SERVICE' | 'DECOMMISSIONED';
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  zoneName: string;
  branchId?: string;
  branchName?: string;
  lastServiceDate?: string;
  nextServiceDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type IEquipmentList = IEquipment;

export interface IEquipmentFilters {
  search?: string;
  category?: string;
  status?: string;
  condition?: string;
  branchId?: string;
}
