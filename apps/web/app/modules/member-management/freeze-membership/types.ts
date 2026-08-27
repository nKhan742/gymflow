import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IFreezeMembership extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IFreezeMembershipFilters {
  search?: string;
  status?: StatusType;
}
