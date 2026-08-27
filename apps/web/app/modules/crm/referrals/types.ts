import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IReferrals extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IReferralsFilters {
  search?: string;
  status?: StatusType;
}
