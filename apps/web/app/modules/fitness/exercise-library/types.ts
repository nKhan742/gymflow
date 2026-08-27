import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IExerciseLibrary extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IExerciseLibraryFilters {
  search?: string;
  status?: StatusType;
}
