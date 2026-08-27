import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IMedicalHistory extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IMedicalHistoryFilters {
  search?: string;
  status?: StatusType;
}
