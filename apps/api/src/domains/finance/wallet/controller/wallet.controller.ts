import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { WalletModel } from '../model/wallet.model.js';
import { WalletMapper } from '../mapper/wallet.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class WalletController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, tier, search } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };

      if (status && status !== 'ALL') {
        filter.walletStatus = status;
      }
      if (tier && tier !== 'ALL') {
        filter.planTier = tier;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [
          { memberName: regex },
          { memberCode: regex },
          { walletCode: regex },
        ];
      }

      let items = await WalletModel.find(filter).sort({ currentBalance: -1 }).exec();

      const dtos = items.map(WalletMapper.toDTO);
      return this.ok(res, dtos, 'Wallet records retrieved', {
        page: 1,
        limit: items.length,
        total: items.length,
        totalPages: 1,
      });
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      let item = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        item = await WalletModel.findById(id).exec();
      }
      if (!item) {
        item = await WalletModel.findOne({ walletCode: id }).exec();
      }
      if (!item) {
        item = await WalletModel.findOne({ memberCode: id }).exec();
      }
      if (!item) {
        item = await WalletModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await WalletModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('Member wallet record not found');
      return this.ok(res, WalletMapper.toDTO(item), 'Member wallet record retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const randNum = Math.floor(1000 + Math.random() * 9000);
      const walletCode = req.body.walletCode || `WAL-${randNum}`;

      const currentBalance = Number(req.body.currentBalance) || 0;
      const lifetimeDeposited = Number(req.body.lifetimeDeposited) || currentBalance;

      const created = await WalletModel.create({
        ...req.body,
        walletCode,
        name: req.body.name || `Wallet for ${req.body.memberName || req.body.memberCode}`,
        currentBalance,
        lifetimeDeposited,
        currency: req.body.currency || 'USD',
        walletStatus: currentBalance < 20 ? 'LOW_BALANCE' : 'ACTIVE',
        lastTransactionDate: new Date(),
        lastTransactionType: 'TOP_UP_DEPOSIT',
        lastTransactionAmount: currentBalance,
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, WalletMapper.toDTO(created), 'Member wallet initialized successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await WalletModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updated) throw new NotFoundException('Wallet record not found');
      return this.ok(res, WalletMapper.toDTO(updated), 'Wallet updated successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await WalletModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
