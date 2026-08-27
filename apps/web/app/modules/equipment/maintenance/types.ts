import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IMaintenance extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IMaintenanceFilters {
  search?: string;
  status?: StatusType;
}
