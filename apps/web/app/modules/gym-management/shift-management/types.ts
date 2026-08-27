import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IShiftManagement extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IShiftManagementFilters {
  search?: string;
  status?: StatusType;
}
