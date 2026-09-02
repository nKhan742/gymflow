import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { DocumentsModel } from '../model/documents.model.js';
import { DocumentsMapper } from '../mapper/documents.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class DocumentsController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, search } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };

      if (type && type !== 'ALL') {
        filter.documentType = type;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [
          { memberName: regex },
          { memberCode: regex },
          { title: regex },
          { fileName: regex },
          { verifiedBy: regex },
        ];
      }

      let items = await DocumentsModel.find(filter).sort({ uploadDate: -1 }).exec();

      const dtos = items.map(DocumentsMapper.toDTO);
      return this.ok(res, dtos, 'Documents records retrieved', {
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
        item = await DocumentsModel.findById(id).exec();
      }
      if (!item) {
        item = await DocumentsModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await DocumentsModel.findOne({ memberCode: id }).exec();
      }
      if (!item) {
        item = await DocumentsModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('Member document not found');
      return this.ok(res, DocumentsMapper.toDTO(item), 'Member document retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const code = req.body.code || `DOC-${Math.floor(1000 + Math.random() * 9000)}`;

      const created = await DocumentsModel.create({
        ...req.body,
        code,
        name: req.body.name || req.body.title || `Document for ${req.body.memberName || req.body.memberCode}`,
        uploadDate: req.body.uploadDate || new Date(),
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, DocumentsMapper.toDTO(created), 'Member document uploaded successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await DocumentsModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updated) throw new NotFoundException('Document record not found');
      return this.ok(res, DocumentsMapper.toDTO(updated), 'Document updated successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await DocumentsModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
