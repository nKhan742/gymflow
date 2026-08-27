import { IFitnessAssessmentModel } from '../model/fitness-assessment.model.js';
import { IFitnessAssessment } from '../interfaces/fitness-assessment.interface.js';

export class FitnessAssessmentMapper {
  static toDTO(model: IFitnessAssessmentModel): IFitnessAssessment {
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
