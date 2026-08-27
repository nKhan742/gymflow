import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IProfileNotifications extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IProfileNotificationsFilters {
  search?: string;
  status?: StatusType;
}
