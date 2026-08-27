import { ITrialMembersModel } from '../model/trial-members.model.js';
import { ITrialMembers } from '../interfaces/trial-members.interface.js';

export class TrialMembersMapper {
  static toDTO(model: ITrialMembersModel): ITrialMembers {
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
