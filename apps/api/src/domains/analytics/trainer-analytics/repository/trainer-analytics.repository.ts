import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { ITrainerAnalyticsModel, TrainerAnalyticsModel } from '../model/trainer-analytics.model.js';

export interface ITrainerAnalyticsRepository extends IBaseRepository<ITrainerAnalyticsModel> {}

export class TrainerAnalyticsRepository extends BaseRepository<ITrainerAnalyticsModel> implements ITrainerAnalyticsRepository {
  constructor() {
    super(TrainerAnalyticsModel);
  }
}
