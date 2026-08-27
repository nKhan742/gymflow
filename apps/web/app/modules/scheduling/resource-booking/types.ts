import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IResourceBooking extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IResourceBookingFilters {
  search?: string;
  status?: StatusType;
}
