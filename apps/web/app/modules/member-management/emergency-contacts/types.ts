import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IEmergencyContacts extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IEmergencyContactsFilters {
  search?: string;
  status?: StatusType;
}
