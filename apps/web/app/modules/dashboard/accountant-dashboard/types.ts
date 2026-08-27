import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IAccountantDashboard extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IAccountantDashboardFilters {
  search?: string;
  status?: StatusType;
}
