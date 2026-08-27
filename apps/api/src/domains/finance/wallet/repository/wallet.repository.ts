import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IWalletModel, WalletModel } from '../model/wallet.model.js';

export interface IWalletRepository extends IBaseRepository<IWalletModel> {}

export class WalletRepository extends BaseRepository<IWalletModel> implements IWalletRepository {
  constructor() {
    super(WalletModel);
  }
}
