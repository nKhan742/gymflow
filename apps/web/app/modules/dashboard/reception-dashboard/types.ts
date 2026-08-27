import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IReceptionDashboard extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IReceptionDashboardFilters {
  search?: string;
  status?: StatusType;
}
