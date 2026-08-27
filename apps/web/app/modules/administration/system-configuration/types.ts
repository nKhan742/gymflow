import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface ISystemConfiguration extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface ISystemConfigurationFilters {
  search?: string;
  status?: StatusType;
}
