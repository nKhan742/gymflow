import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IAuditLogs extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IAuditLogsFilters {
  search?: string;
  status?: StatusType;
}
