import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IGymProfile extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IGymProfileFilters {
  search?: string;
  status?: StatusType;
}
