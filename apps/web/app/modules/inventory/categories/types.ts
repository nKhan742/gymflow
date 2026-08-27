import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface ICategories extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface ICategoriesFilters {
  search?: string;
  status?: StatusType;
}
