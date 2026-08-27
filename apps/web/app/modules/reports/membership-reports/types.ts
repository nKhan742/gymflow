import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IMembershipReports extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IMembershipReportsFilters {
  search?: string;
  status?: StatusType;
}
