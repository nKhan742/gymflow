import { IWalletModel } from '../model/wallet.model.js';
import { IWallet } from '../interfaces/wallet.interface.js';

export class WalletMapper {
  static toDTO(model: IWalletModel): IWallet {
    return {
      id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name,
      code: model.code,
      description: model.description,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
