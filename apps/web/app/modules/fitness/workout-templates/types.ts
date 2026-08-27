import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IWorkoutTemplates extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IWorkoutTemplatesFilters {
  search?: string;
  status?: StatusType;
}
