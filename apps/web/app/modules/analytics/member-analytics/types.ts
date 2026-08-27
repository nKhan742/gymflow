import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IMemberAnalytics extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IMemberAnalyticsFilters {
  search?: string;
  status?: StatusType;
}
