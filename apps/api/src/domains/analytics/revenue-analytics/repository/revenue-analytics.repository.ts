import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IRevenueAnalyticsModel, RevenueAnalyticsModel } from '../model/revenue-analytics.model.js';

export interface IRevenueAnalyticsRepository extends IBaseRepository<IRevenueAnalyticsModel> {}

export class RevenueAnalyticsRepository extends BaseRepository<IRevenueAnalyticsModel> implements IRevenueAnalyticsRepository {
  constructor() {
    super(RevenueAnalyticsModel);
  }
}
