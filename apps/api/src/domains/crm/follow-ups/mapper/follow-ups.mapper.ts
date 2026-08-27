import { IFollowUpsModel } from '../model/follow-ups.model.js';
import { IFollowUps } from '../interfaces/follow-ups.interface.js';

export class FollowUpsMapper {
  static toDTO(model: IFollowUpsModel): IFollowUps {
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
