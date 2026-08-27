import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IFitnessAssessmentModel, FitnessAssessmentModel } from '../model/fitness-assessment.model.js';

export interface IFitnessAssessmentRepository extends IBaseRepository<IFitnessAssessmentModel> {}

export class FitnessAssessmentRepository extends BaseRepository<IFitnessAssessmentModel> implements IFitnessAssessmentRepository {
  constructor() {
    super(FitnessAssessmentModel);
  }
}
