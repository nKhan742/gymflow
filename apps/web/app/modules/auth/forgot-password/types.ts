import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IForgotPassword extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IForgotPasswordFilters {
  search?: string;
  status?: StatusType;
}
