import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IAttendance extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IAttendanceFilters {
  search?: string;
  status?: StatusType;
}
