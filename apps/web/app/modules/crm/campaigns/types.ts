import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface ICampaigns extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface ICampaignsFilters {
  search?: string;
  status?: StatusType;
}
