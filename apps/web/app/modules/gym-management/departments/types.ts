import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IDepartments extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IDepartmentsFilters {
  search?: string;
  status?: StatusType;
}
