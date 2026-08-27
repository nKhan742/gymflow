import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface ITransformation extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface ITransformationFilters {
  search?: string;
  status?: StatusType;
}
