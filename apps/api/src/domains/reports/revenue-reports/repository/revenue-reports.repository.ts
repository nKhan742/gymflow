import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IRevenueReportsModel, RevenueReportsModel } from '../model/revenue-reports.model.js';

export interface IRevenueReportsRepository extends IBaseRepository<IRevenueReportsModel> {}

export class RevenueReportsRepository extends BaseRepository<IRevenueReportsModel> implements IRevenueReportsRepository {
  constructor() {
    super(RevenueReportsModel);
  }
}
