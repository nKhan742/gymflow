import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IMembershipPlans extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IMembershipPlansFilters {
  search?: string;
  status?: StatusType;
}
