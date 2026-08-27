import { IExerciseLibraryModel } from '../model/exercise-library.model.js';
import { IExerciseLibrary } from '../interfaces/exercise-library.interface.js';

export class ExerciseLibraryMapper {
  static toDTO(model: IExerciseLibraryModel): IExerciseLibrary {
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
