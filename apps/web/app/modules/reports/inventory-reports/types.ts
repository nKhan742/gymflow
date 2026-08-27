import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IInventoryReports extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IInventoryReportsFilters {
  search?: string;
  status?: StatusType;
}
