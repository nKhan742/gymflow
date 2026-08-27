import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IMealLibrary extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IMealLibraryFilters {
  search?: string;
  status?: StatusType;
}
