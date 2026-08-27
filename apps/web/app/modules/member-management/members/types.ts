import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IMembers extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IMembersFilters {
  search?: string;
  status?: StatusType;
}
