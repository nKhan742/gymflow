import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IEmail extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IEmailFilters {
  search?: string;
  status?: StatusType;
}
