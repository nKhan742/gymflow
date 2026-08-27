import { IMembersModel } from '../model/members.model.js';
import { IMembers } from '../interfaces/members.interface.js';

export class MembersMapper {
  static toDTO(model: IMembersModel): IMembers {
    return {
      id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      memberCode: model.memberCode,
      firstName: model.firstName,
      lastName: model.lastName,
      email: model.email,
      phone: model.phone,
      membership: model.membership,
      assignedTrainer: model.assignedTrainer,
      emergencyContact: model.emergencyContact,
      status: model.status,
      memberStatus: model.memberStatus,
      stats: model.stats,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
