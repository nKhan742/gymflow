import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface ILogin extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface ILoginFilters {
  search?: string;
  status?: StatusType;
}
