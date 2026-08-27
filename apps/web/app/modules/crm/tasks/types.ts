import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface ITasks extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface ITasksFilters {
  search?: string;
  status?: StatusType;
}
