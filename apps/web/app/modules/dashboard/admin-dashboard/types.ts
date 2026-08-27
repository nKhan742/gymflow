import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IAdminDashboard extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IAdminDashboardFilters {
  search?: string;
  status?: StatusType;
}
