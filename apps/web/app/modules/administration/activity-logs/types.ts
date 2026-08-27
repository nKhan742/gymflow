import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IActivityLogs extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IActivityLogsFilters {
  search?: string;
  status?: StatusType;
}
