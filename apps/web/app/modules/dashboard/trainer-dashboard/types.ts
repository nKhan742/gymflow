import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface ITrainerDashboard extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface ITrainerDashboardFilters {
  search?: string;
  status?: StatusType;
}
