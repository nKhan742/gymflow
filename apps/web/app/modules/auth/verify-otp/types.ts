import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IVerifyOtp extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IVerifyOtpFilters {
  search?: string;
  status?: StatusType;
}
