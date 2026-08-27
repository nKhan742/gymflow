import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IAttendanceAnalytics extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IAttendanceAnalyticsFilters {
  search?: string;
  status?: StatusType;
}
