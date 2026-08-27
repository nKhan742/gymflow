import { INutritionTrackingModel } from '../model/nutrition-tracking.model.js';
import { INutritionTracking } from '../interfaces/nutrition-tracking.interface.js';

export class NutritionTrackingMapper {
  static toDTO(model: INutritionTrackingModel): INutritionTracking {
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
