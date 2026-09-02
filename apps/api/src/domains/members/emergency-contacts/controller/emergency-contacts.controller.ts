import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { EmergencyContactsModel } from '../model/emergency-contacts.model.js';
import { EmergencyContactsMapper } from '../mapper/emergency-contacts.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class EmergencyContactsController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { priority, search } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };

      if (priority && priority !== 'ALL') {
        filter.priority = priority;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [
          { memberName: regex },
          { memberCode: regex },
          { contactName: regex },
          { phone: regex },
          { relationship: regex },
        ];
      }

      let items = await EmergencyContactsModel.find(filter).sort({ priority: 1, createdAt: -1 }).exec();

      const dtos = items.map(EmergencyContactsMapper.toDTO);
      return this.ok(res, dtos, 'EmergencyContacts records retrieved', {
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
        item = await EmergencyContactsModel.findById(id).exec();
      }
      if (!item) {
        item = await EmergencyContactsModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await EmergencyContactsModel.findOne({ memberCode: id }).exec();
      }
      if (!item) {
        item = await EmergencyContactsModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('Emergency contact record not found');
      return this.ok(res, EmergencyContactsMapper.toDTO(item), 'Emergency contact record retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const code = req.body.code || `EMG-${Math.floor(1000 + Math.random() * 9000)}`;

      const created = await EmergencyContactsModel.create({
        ...req.body,
        code,
        name: req.body.name || `Emergency Contact for ${req.body.memberName || req.body.memberCode}`,
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, EmergencyContactsMapper.toDTO(created), 'Emergency contact recorded successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await EmergencyContactsModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updated) throw new NotFoundException('Emergency contact record not found');
      return this.ok(res, EmergencyContactsMapper.toDTO(updated), 'Emergency contact updated successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await EmergencyContactsModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
