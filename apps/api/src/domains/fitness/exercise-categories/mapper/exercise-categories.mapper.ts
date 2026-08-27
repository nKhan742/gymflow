import { IExerciseCategoriesModel } from '../model/exercise-categories.model.js';
import { IExerciseCategories } from '../interfaces/exercise-categories.interface.js';

export class ExerciseCategoriesMapper {
  static toDTO(model: IExerciseCategoriesModel): IExerciseCategories {
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
