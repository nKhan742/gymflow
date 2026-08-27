import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IGrowthAnalyticsModel, GrowthAnalyticsModel } from '../model/growth-analytics.model.js';

export interface IGrowthAnalyticsRepository extends IBaseRepository<IGrowthAnalyticsModel> {}

export class GrowthAnalyticsRepository extends BaseRepository<IGrowthAnalyticsModel> implements IGrowthAnalyticsRepository {
  constructor() {
    super(GrowthAnalyticsModel);
  }
}
