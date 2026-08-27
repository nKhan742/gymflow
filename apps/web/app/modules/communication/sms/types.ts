import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface ISms extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface ISmsFilters {
  search?: string;
  status?: StatusType;
}
