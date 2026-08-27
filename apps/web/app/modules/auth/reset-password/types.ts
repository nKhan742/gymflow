import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IResetPassword extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IResetPasswordFilters {
  search?: string;
  status?: StatusType;
}
