import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IPermissions extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IPermissionsFilters {
  search?: string;
  status?: StatusType;
}
