import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { AttendanceModel } from '../model/attendance.model.js';
import { AttendanceMapper } from '../mapper/attendance.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class AttendanceController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, search } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };

      if (status && status !== 'ALL') {
        filter.accessResult = status;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [
          { memberName: regex },
          { memberCode: regex },
          { gateLocation: regex },
          { method: regex },
        ];
      }

      let items = await AttendanceModel.find(filter).sort({ checkInTime: -1 }).exec();

      const dtos = items.map(AttendanceMapper.toDTO);
      return this.ok(res, dtos, 'Attendance records retrieved', {
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
        item = await AttendanceModel.findById(id).exec();
      }
      if (!item) {
        item = await AttendanceModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await AttendanceModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('Attendance record not found');
      return this.ok(res, AttendanceMapper.toDTO(item), 'Attendance record retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const code = req.body.code || `ATT-${Math.floor(1000 + Math.random() * 9000)}`;
      const created = await AttendanceModel.create({
        ...req.body,
        code,
        name: req.body.name || `Check-in for ${req.body.memberName || req.body.memberCode}`,
        checkInTime: req.body.checkInTime || new Date(),
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, AttendanceMapper.toDTO(created), 'Attendance record logged successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await AttendanceModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updated) throw new NotFoundException('Attendance record not found');
      return this.ok(res, AttendanceMapper.toDTO(updated), 'Attendance record updated successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await AttendanceModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
