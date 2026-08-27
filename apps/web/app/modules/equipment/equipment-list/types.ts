import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IEquipmentList extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IEquipmentListFilters {
  search?: string;
  status?: StatusType;
}
