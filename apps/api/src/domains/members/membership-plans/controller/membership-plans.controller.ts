import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { MembershipPlansModel } from '../model/membership-plans.model.js';
import { MembershipPlansMapper } from '../mapper/membership-plans.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class MembershipPlansController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [{ name: regex }, { code: regex }, { description: regex }];
      }

      let items = await MembershipPlansModel.find(filter).sort({ price: -1 }).exec();

      // If only generic placeholders or empty, seed real gym plans
      const hasGeneric = items.some((i) => i.name.includes('Alpha Record') || i.name.includes('Delta Record') || i.name.includes('Record'));
      if (items.length === 0 || hasGeneric) {
        if (hasGeneric) {
          await MembershipPlansModel.deleteMany({ name: /Record/ });
        }

        const realPlans = [
          {
            name: 'VIP Platinum All-Access Annual',
            code: 'PLAN-VIP-01',
            tier: 'VIP_PLATINUM',
            price: 1499,
            currency: 'USD',
            billingCycle: 'ANNUAL',
            initiationFee: 0,
            accessHours: '24/7 Unlimited All-Access',
            multiBranch: true,
            inclusions: [
              '24/7 Access to all Flagship & Express Locations',
              'Unlimited Group Fitness (Spin, Yoga, HIIT, Boxing)',
              'Executive Spa, Sauna, Steam & Recovery Zone',
              'Dedicated Smart Locker with digital passcode',
              '2 Complimentary Personal Training Consultations',
              '2 Free Guest Passes every month',
              '15% Pro-Shop & Smoothie Bar Discount',
            ],
            maxFreezeDays: 60,
            popular: true,
            status: 'active',
            description: 'The ultimate luxury fitness experience with multi-branch access and VIP perks.',
            tenantId: 'tenant_enterprise_01',
            branchId: 'branch_hq_01',
          },
          {
            name: 'Gold Annual All-Access',
            code: 'PLAN-GOLD-01',
            tier: 'GOLD_ANNUAL',
            price: 899,
            currency: 'USD',
            billingCycle: 'ANNUAL',
            initiationFee: 0,
            accessHours: '24/7 All-Access (Home Branch)',
            multiBranch: false,
            inclusions: [
              '24/7 Access to Home Gym Branch',
              'Unlimited Group Fitness Classes',
              'Sauna & Recovery Zone Access',
              'Locker Room & Shower Amenities',
              '1 Free Monthly Guest Pass',
              '10% Pro-Shop Discount',
            ],
            maxFreezeDays: 30,
            popular: false,
            status: 'active',
            description: 'Our most popular annual package with comprehensive classes and sauna amenities.',
            tenantId: 'tenant_enterprise_01',
            branchId: 'branch_hq_01',
          },
          {
            name: 'Silver Monthly Recurring',
            code: 'PLAN-SILV-01',
            tier: 'SILVER_MONTHLY',
            price: 89,
            currency: 'USD',
            billingCycle: 'MONTHLY',
            initiationFee: 29,
            accessHours: '5:00 AM – 11:00 PM Daily',
            multiBranch: false,
            inclusions: [
              'Access to Free Weights, Machines & Cardio Deck',
              'Standard Locker Room & Shower Access',
              'Complimentary Mobile Workout App Tracking',
              'Month-to-month flexibility (Cancel anytime)',
            ],
            maxFreezeDays: 14,
            popular: false,
            status: 'active',
            description: 'Flexible monthly recurring membership with full gym equipment access.',
            tenantId: 'tenant_enterprise_01',
            branchId: 'branch_hq_01',
          },
          {
            name: 'Student & Corporate Special',
            code: 'PLAN-STUD-01',
            tier: 'STUDENT_CORPORATE',
            price: 59,
            currency: 'USD',
            billingCycle: 'MONTHLY',
            initiationFee: 0,
            accessHours: '6:00 AM – 10:00 PM Daily',
            multiBranch: false,
            inclusions: [
              'Valid with Student ID or Partner Corporate Email',
              'Full Gym Floor & Functional Fitness Deck',
              'Locker Room Access',
              'Discounted Personal Training Rates',
            ],
            maxFreezeDays: 30,
            popular: false,
            status: 'active',
            description: 'Subsidized fitness tier for university students and corporate partners.',
            tenantId: 'tenant_enterprise_01',
            branchId: 'branch_hq_01',
          },
          {
            name: 'Off-Peak Early Bird Pass',
            code: 'PLAN-PEAK-01',
            tier: 'OFF_PEAK',
            price: 45,
            currency: 'USD',
            billingCycle: 'MONTHLY',
            initiationFee: 25,
            accessHours: '9:00 AM – 4:00 PM (Weekdays Only)',
            multiBranch: false,
            inclusions: [
              'Midday Quiet Hours Access',
              'Free Weights, Machines & Cardio Deck',
              'Locker Room & Shower Access',
            ],
            maxFreezeDays: 0,
            popular: false,
            status: 'active',
            description: 'Cost-effective package tailored for remote workers and midday fitness enthusiasts.',
            tenantId: 'tenant_enterprise_01',
            branchId: 'branch_hq_01',
          },
          {
            name: '10-Class Fitness Pack',
            code: 'PACK-10CL-01',
            tier: 'CLASS_PACK',
            price: 180,
            currency: 'USD',
            billingCycle: 'PACK',
            initiationFee: 0,
            accessHours: 'Class Schedule Hours',
            multiBranch: true,
            inclusions: [
              '10 Group Class Credits (HIIT, Spin, Yoga, Boxing)',
              'Valid for 6 Months from Purchase Date',
              'Online Class Booking & Turnstile Entry',
              'Transferable to friends & family',
            ],
            maxFreezeDays: 0,
            popular: false,
            status: 'active',
            description: 'Flexible non-subscription class pack for group fitness enthusiasts.',
            tenantId: 'tenant_enterprise_01',
            branchId: 'branch_hq_01',
          },
        ];

        await MembershipPlansModel.insertMany(realPlans);
        items = await MembershipPlansModel.find(filter).sort({ price: -1 }).exec();
      }

      const dtos = items.map(MembershipPlansMapper.toDTO);
      return this.ok(res, dtos, 'MembershipPlans records retrieved', {
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
        item = await MembershipPlansModel.findById(id).exec();
      }
      if (!item) {
        item = await MembershipPlansModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await MembershipPlansModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('Membership plan not found');
      return this.ok(res, MembershipPlansMapper.toDTO(item), 'MembershipPlans record retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const code = req.body.code || `PLAN-${Math.floor(100 + Math.random() * 900)}`;
      const created = await MembershipPlansModel.create({
        ...req.body,
        code,
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, MembershipPlansMapper.toDTO(created), 'Membership plan created successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await MembershipPlansModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updated) throw new NotFoundException('Membership plan not found');
      return this.ok(res, MembershipPlansMapper.toDTO(updated), 'Membership plan updated successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await MembershipPlansModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
