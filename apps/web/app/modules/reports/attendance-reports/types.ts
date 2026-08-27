import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IAttendanceReports extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IAttendanceReportsFilters {
  search?: string;
  status?: StatusType;
}
