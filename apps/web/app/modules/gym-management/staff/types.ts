import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IStaff extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IStaffFilters {
  search?: string;
  status?: StatusType;
}
