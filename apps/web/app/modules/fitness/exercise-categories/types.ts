import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IExerciseCategories extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IExerciseCategoriesFilters {
  search?: string;
  status?: StatusType;
}
