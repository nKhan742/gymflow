import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IProfileChangePassword extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IProfileChangePasswordFilters {
  search?: string;
  status?: StatusType;
}
