import { StatusType } from '../../../../database/base.model.js';

export interface IWallet {
  id: string;
  _id?: string;
  tenantId: string;
  branchId?: string;
  name: string;
  code?: string;
  description?: string;
  walletCode: string;
  memberId?: string;
  memberCode: string;
  memberName: string;
  planTier: string;
  currentBalance: number;
  lifetimeDeposited: number;
  lifetimeSpent: number;
  rewardPoints: number;
  currency: string;
  autoTopUpEnabled: boolean;
  autoTopUpThreshold?: number;
  autoTopUpAmount?: number;
  lastTransactionDate?: Date;
  lastTransactionType?: 'TOP_UP_DEPOSIT' | 'CAFE_POS_DEBIT' | 'SESSION_DEBIT' | 'CASHBACK_REWARD' | 'REFUND_CREDIT';
  lastTransactionAmount?: number;
  walletStatus: 'ACTIVE' | 'LOW_BALANCE' | 'FROZEN';
  notes?: string;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}
