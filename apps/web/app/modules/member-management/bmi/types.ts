import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IBmi extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IBmiFilters {
  search?: string;
  status?: StatusType;
}
