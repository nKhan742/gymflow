import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { ITrainerReportsModel, TrainerReportsModel } from '../model/trainer-reports.model.js';

export interface ITrainerReportsRepository extends IBaseRepository<ITrainerReportsModel> {}

export class TrainerReportsRepository extends BaseRepository<ITrainerReportsModel> implements ITrainerReportsRepository {
  constructor() {
    super(TrainerReportsModel);
  }
}
