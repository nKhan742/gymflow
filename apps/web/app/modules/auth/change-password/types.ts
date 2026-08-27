import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IChangePassword extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IChangePasswordFilters {
  search?: string;
  status?: StatusType;
}
