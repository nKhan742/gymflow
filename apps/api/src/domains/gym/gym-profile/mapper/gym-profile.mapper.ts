import { IGymProfileModel } from '../model/gym-profile.model.js';
import { IGymProfile } from '../interfaces/gym-profile.interface.js';

export class GymProfileMapper {
  static toDTO(model: IGymProfileModel): IGymProfile {
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
