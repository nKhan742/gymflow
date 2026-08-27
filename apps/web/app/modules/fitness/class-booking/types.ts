import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IClassBooking extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IClassBookingFilters {
  search?: string;
  status?: StatusType;
}
