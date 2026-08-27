import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IRoles extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IRolesFilters {
  search?: string;
  status?: StatusType;
}
