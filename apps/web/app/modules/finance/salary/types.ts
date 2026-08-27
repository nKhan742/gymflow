import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface ISalary extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface ISalaryFilters {
  search?: string;
  status?: StatusType;
}
