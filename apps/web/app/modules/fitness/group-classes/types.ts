import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IGroupClasses extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IGroupClassesFilters {
  search?: string;
  status?: StatusType;
}
