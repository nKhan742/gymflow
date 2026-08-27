import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface ILeads extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface ILeadsFilters {
  search?: string;
  status?: StatusType;
}
