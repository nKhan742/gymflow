import { ILeadsModel } from '../model/leads.model.js';
import { ILeads } from '../interfaces/leads.interface.js';

export class LeadsMapper {
  static toDTO(model: ILeadsModel): ILeads {
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
