import { IBranchesModel } from '../model/branches.model.js';
import { IBranches } from '../interfaces/branches.interface.js';

export class BranchesMapper {
  static toDTO(model: IBranchesModel): IBranches {
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
