import { IVisitorsModel } from '../model/visitors.model.js';
import { IVisitors } from '../interfaces/visitors.interface.js';

export class VisitorsMapper {
  static toDTO(model: IVisitorsModel): IVisitors {
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
