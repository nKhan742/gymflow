import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IFitnessAssessment extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IFitnessAssessmentFilters {
  search?: string;
  status?: StatusType;
}
