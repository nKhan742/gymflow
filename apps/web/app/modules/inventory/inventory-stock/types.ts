import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IInventoryStock extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IInventoryStockFilters {
  search?: string;
  status?: StatusType;
}
