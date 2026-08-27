import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IFinanceReports extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IFinanceReportsFilters {
  search?: string;
  status?: StatusType;
}
