import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface ITrialMembers extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface ITrialMembersFilters {
  search?: string;
  status?: StatusType;
}
