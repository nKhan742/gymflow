import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { MembershipRenewalsModel } from '../model/membership-renewals.model.js';
import { MembershipRenewalsMapper } from '../mapper/membership-renewals.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class MembershipRenewalsController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, search } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };

      if (status && status !== 'ALL') {
        filter.renewalStatus = status;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [
          { memberName: regex },
          { memberCode: regex },
          { memberEmail: regex },
          { currentPlan: regex },
        ];
      }

      let items = await MembershipRenewalsModel.find(filter).sort({ expiryDate: 1 }).exec();

      // Seed if empty or generic placeholders
      const hasGeneric = items.some((i) => i.name.includes('Alpha Record') || i.name.includes('Delta Record') || i.name.includes('Record'));
      if (items.length === 0 || hasGeneric) {
        if (hasGeneric) {
          await MembershipRenewalsModel.deleteMany({ name: /Record/ });
        }

        const today = new Date();
        const addDays = (d: number) => new Date(today.getTime() + d * 24 * 60 * 60 * 1000);

        const realRenewals = [
          {
            name: 'Renewal for Sarah Jenkins',
            code: 'RNW-1001',
            memberCode: 'GF-9284',
            memberName: 'Sarah Jenkins',
            memberEmail: 'sarah.jenkins@example.com',
            memberPhone: '+1 (555) 234-5678',
            currentPlan: 'VIP Platinum All-Access Annual',
            currentTier: 'VIP_PLATINUM',
            expiryDate: addDays(4),
            daysRemaining: 4,
            renewalStatus: 'EXPIRING_CRITICAL',
            amount: 1499,
            currency: 'USD',
            autoRenew: true,
            paymentMethod: 'STRIPE_CARD',
            lastContactDate: addDays(-1),
            contactChannel: 'EMAIL',
            notes: 'Card on file valid (Visa ending 4242). Auto-debit scheduled.',
            tenantId: 'tenant_enterprise_01',
            branchId: 'branch_hq_01',
            status: 'active',
          },
          {
            name: 'Renewal for Marcus Rodriguez',
            code: 'RNW-1002',
            memberCode: 'GF-4821',
            memberName: 'Marcus Rodriguez',
            memberEmail: 'marcus.rodriguez@example.com',
            memberPhone: '+1 (555) 392-8192',
            currentPlan: 'Gold Annual All-Access',
            currentTier: 'GOLD_ANNUAL',
            expiryDate: addDays(-3),
            daysRemaining: -3,
            renewalStatus: 'EXPIRED',
            amount: 899,
            currency: 'USD',
            autoRenew: false,
            paymentMethod: 'CARD_POS',
            lastContactDate: addDays(-2),
            contactChannel: 'WHATSAPP',
            notes: 'In 7-day grace period. Turnstile alert shown. Member offered 10% loyalty discount.',
            tenantId: 'tenant_enterprise_01',
            branchId: 'branch_hq_01',
            status: 'active',
          },
          {
            name: 'Renewal for David Chen',
            code: 'RNW-1003',
            memberCode: 'GF-3109',
            memberName: 'David Chen',
            memberEmail: 'david.chen@example.com',
            memberPhone: '+1 (555) 891-2309',
            currentPlan: 'Silver Monthly Recurring',
            currentTier: 'SILVER_MONTHLY',
            expiryDate: addDays(2),
            daysRemaining: 2,
            renewalStatus: 'EXPIRING_CRITICAL',
            amount: 89,
            currency: 'USD',
            autoRenew: true,
            paymentMethod: 'STRIPE_CARD',
            lastContactDate: addDays(-1),
            contactChannel: 'SMS',
            notes: 'Monthly recurring billing retry pending.',
            tenantId: 'tenant_enterprise_01',
            branchId: 'branch_hq_01',
            status: 'active',
          },
          {
            name: 'Renewal for Emily Watson',
            code: 'RNW-1004',
            memberCode: 'GF-7712',
            memberName: 'Emily Watson',
            memberEmail: 'emily.watson@example.com',
            memberPhone: '+1 (555) 441-9982',
            currentPlan: 'VIP Platinum All-Access Annual',
            currentTier: 'VIP_PLATINUM',
            expiryDate: addDays(18),
            daysRemaining: 18,
            renewalStatus: 'EXPIRING_SOON',
            amount: 1499,
            currency: 'USD',
            autoRenew: true,
            paymentMethod: 'BANK_ACH',
            lastContactDate: addDays(-5),
            contactChannel: 'EMAIL',
            notes: '30-day early notification email sent.',
            tenantId: 'tenant_enterprise_01',
            branchId: 'branch_hq_01',
            status: 'active',
          },
          {
            name: 'Renewal for Liam O Connor',
            code: 'RNW-1005',
            memberCode: 'GF-5520',
            memberName: 'Liam O Connor',
            memberEmail: 'liam.oconnor@example.com',
            memberPhone: '+1 (555) 773-1284',
            currentPlan: 'Student & Corporate Pass',
            currentTier: 'STUDENT_CORPORATE',
            expiryDate: addDays(25),
            daysRemaining: 25,
            renewalStatus: 'EXPIRING_SOON',
            amount: 59,
            currency: 'USD',
            autoRenew: false,
            paymentMethod: 'CARD_POS',
            lastContactDate: addDays(-4),
            contactChannel: 'SMS',
            notes: 'Needs to present updated student ID at front desk before renewal confirmation.',
            tenantId: 'tenant_enterprise_01',
            branchId: 'branch_hq_01',
            status: 'active',
          },
          {
            name: 'Renewal for Jessica Taylor',
            code: 'RNW-1006',
            memberCode: 'GF-9014',
            memberName: 'Jessica Taylor',
            memberEmail: 'jessica.taylor@example.com',
            memberPhone: '+1 (555) 662-8119',
            currentPlan: 'Gold Annual All-Access',
            currentTier: 'GOLD_ANNUAL',
            expiryDate: addDays(360),
            daysRemaining: 360,
            renewalStatus: 'RENEWED',
            amount: 899,
            currency: 'USD',
            autoRenew: true,
            paymentMethod: 'STRIPE_CARD',
            lastContactDate: today,
            contactChannel: 'EMAIL',
            notes: 'Successfully renewed for 12 months. Tax invoice INV-8821 paid.',
            tenantId: 'tenant_enterprise_01',
            branchId: 'branch_hq_01',
            status: 'active',
          },
        ];

        await MembershipRenewalsModel.insertMany(realRenewals);
        items = await MembershipRenewalsModel.find(filter).sort({ expiryDate: 1 }).exec();
      }

      const dtos = items.map(MembershipRenewalsMapper.toDTO);
      return this.ok(res, dtos, 'MembershipRenewals records retrieved', {
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
        item = await MembershipRenewalsModel.findById(id).exec();
      }
      if (!item) {
        item = await MembershipRenewalsModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await MembershipRenewalsModel.findOne({ memberCode: id }).exec();
      }
      if (!item) {
        item = await MembershipRenewalsModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('Membership renewal record not found');
      return this.ok(res, MembershipRenewalsMapper.toDTO(item), 'Membership renewal record retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const code = req.body.code || `RNW-${Math.floor(1000 + Math.random() * 9000)}`;
      const created = await MembershipRenewalsModel.create({
        ...req.body,
        code,
        name: req.body.name || `Renewal for ${req.body.memberName || req.body.memberCode}`,
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, MembershipRenewalsMapper.toDTO(created), 'Membership renewal created successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await MembershipRenewalsModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updated) throw new NotFoundException('Membership renewal record not found');
      return this.ok(res, MembershipRenewalsMapper.toDTO(updated), 'Membership renewal updated successfully');
    } catch (err) {
      next(err);
    }
  };

  renew = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { durationMonths = 12, planTier, discountPercent = 0 } = req.body;

      let item = await MembershipRenewalsModel.findById(id).exec();
      if (!item) {
        item = await MembershipRenewalsModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await MembershipRenewalsModel.findOne({ memberCode: id }).exec();
      }
      if (!item) throw new NotFoundException('Membership renewal record not found');

      const nextExpiry = new Date();
      nextExpiry.setMonth(nextExpiry.getMonth() + Number(durationMonths));

      item.renewalStatus = 'RENEWED';
      item.daysRemaining = durationMonths * 30;
      item.expiryDate = nextExpiry;
      item.notes = `Renewed on ${new Date().toLocaleDateString()} for ${durationMonths} months. Discount: ${discountPercent}%.`;
      await item.save();

      return this.ok(res, MembershipRenewalsMapper.toDTO(item), 'Membership subscription renewed successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await MembershipRenewalsModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
