import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IBodyMeasurements extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IBodyMeasurementsFilters {
  search?: string;
  status?: StatusType;
}
