import { IReferralsModel } from '../model/referrals.model.js';
import { IReferrals } from '../interfaces/referrals.interface.js';

export class ReferralsMapper {
  static toDTO(model: IReferralsModel): IReferrals {
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
