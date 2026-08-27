import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IStockAdjustment extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IStockAdjustmentFilters {
  search?: string;
  status?: StatusType;
}
