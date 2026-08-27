import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IUsers extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IUsersFilters {
  search?: string;
  status?: StatusType;
}
