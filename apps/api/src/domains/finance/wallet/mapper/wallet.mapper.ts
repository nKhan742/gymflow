import { IWalletModel } from '../model/wallet.model.js';
import { IWallet } from '../interfaces/wallet.interface.js';

export class WalletMapper {
  static toDTO(model: IWalletModel): IWallet {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || `Wallet for ${model.memberName || model.memberCode}`,
      code: model.code || model.walletCode || 'WAL-001',
      description: model.description,
      walletCode: model.walletCode || 'WAL-1001',
      memberId: model.memberId,
      memberCode: model.memberCode || 'GF-1001',
      memberName: model.memberName || 'Gym Member',
      planTier: model.planTier || 'VIP_PLATINUM',
      currentBalance: model.currentBalance ?? 0,
      lifetimeDeposited: model.lifetimeDeposited ?? 0,
      lifetimeSpent: model.lifetimeSpent ?? 0,
      rewardPoints: model.rewardPoints ?? 0,
      currency: model.currency || 'USD',
      autoTopUpEnabled: model.autoTopUpEnabled ?? false,
      autoTopUpThreshold: model.autoTopUpThreshold,
      autoTopUpAmount: model.autoTopUpAmount,
      lastTransactionDate: model.lastTransactionDate || model.updatedAt,
      lastTransactionType: model.lastTransactionType || 'TOP_UP_DEPOSIT',
      lastTransactionAmount: model.lastTransactionAmount ?? 0,
      walletStatus: model.walletStatus || 'ACTIVE',
      notes: model.notes,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
