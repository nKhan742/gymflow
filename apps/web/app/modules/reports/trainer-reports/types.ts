import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface ITrainerReports extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface ITrainerReportsFilters {
  search?: string;
  status?: StatusType;
}
