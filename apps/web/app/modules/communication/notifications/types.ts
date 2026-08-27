import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface INotifications extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface INotificationsFilters {
  search?: string;
  status?: StatusType;
}
