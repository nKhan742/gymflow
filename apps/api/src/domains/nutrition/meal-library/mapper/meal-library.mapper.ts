import { IMealLibraryModel } from '../model/meal-library.model.js';
import { IMealLibrary } from '../interfaces/meal-library.interface.js';

export class MealLibraryMapper {
  static toDTO(model: IMealLibraryModel): IMealLibrary {
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
