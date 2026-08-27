import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface ISettings extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface ISettingsFilters {
  search?: string;
  status?: StatusType;
}
