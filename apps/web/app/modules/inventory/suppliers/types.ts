import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface ISuppliers extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface ISuppliersFilters {
  search?: string;
  status?: StatusType;
}
