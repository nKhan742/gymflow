import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IWorkoutAssignment extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IWorkoutAssignmentFilters {
  search?: string;
  status?: StatusType;
}
