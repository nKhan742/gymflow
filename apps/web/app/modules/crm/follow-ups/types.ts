import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IFollowUps extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IFollowUpsFilters {
  search?: string;
  status?: StatusType;
}
