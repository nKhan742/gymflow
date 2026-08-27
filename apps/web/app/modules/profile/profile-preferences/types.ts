import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IProfilePreferences extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IProfilePreferencesFilters {
  search?: string;
  status?: StatusType;
}
