import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IMembershipRenewals extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IMembershipRenewalsFilters {
  search?: string;
  status?: StatusType;
}
