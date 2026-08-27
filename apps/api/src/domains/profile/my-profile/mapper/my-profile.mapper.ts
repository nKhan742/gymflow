import { IMyProfileModel } from '../model/my-profile.model.js';
import { IMyProfile } from '../interfaces/my-profile.interface.js';

export class MyProfileMapper {
  static toDTO(model: IMyProfileModel): IMyProfile {
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
