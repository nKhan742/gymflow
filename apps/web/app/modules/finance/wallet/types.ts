import { IBaseEntity, StatusType } from '@core/types/common.types';

export interface IWallet extends IBaseEntity {
  name: string;
  code?: string;
  status: StatusType;
  description?: string;
}

export interface IWalletFilters {
  search?: string;
  status?: StatusType;
}
