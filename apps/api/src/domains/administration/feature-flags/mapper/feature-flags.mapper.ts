import { IFeatureFlagsModel } from '../model/feature-flags.model.js';
import { IFeatureFlags } from '../interfaces/feature-flags.interface.js';

export class FeatureFlagsMapper {
  static toDTO(model: IFeatureFlagsModel): IFeatureFlags {
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
