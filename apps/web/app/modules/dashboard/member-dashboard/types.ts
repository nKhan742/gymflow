import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IMemberDashboard extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IMemberDashboardFilters {
  search?: string;
  status?: StatusType;
}
