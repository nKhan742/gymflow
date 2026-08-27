import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface ITrainerAnalytics extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface ITrainerAnalyticsFilters {
  search?: string;
  status?: StatusType;
}
