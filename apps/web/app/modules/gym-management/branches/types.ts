import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IBranches extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IBranchesFilters {
  search?: string;
  status?: StatusType;
}
