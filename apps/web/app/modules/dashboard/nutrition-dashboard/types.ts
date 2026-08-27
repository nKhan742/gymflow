import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface INutritionDashboard extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface INutritionDashboardFilters {
  search?: string;
  status?: StatusType;
}
