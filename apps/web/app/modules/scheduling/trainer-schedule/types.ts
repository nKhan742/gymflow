import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface ITrainerSchedule extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface ITrainerScheduleFilters {
  search?: string;
  status?: StatusType;
}
