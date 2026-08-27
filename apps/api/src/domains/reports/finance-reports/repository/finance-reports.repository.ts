import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IFinanceReportsModel, FinanceReportsModel } from '../model/finance-reports.model.js';

export interface IFinanceReportsRepository extends IBaseRepository<IFinanceReportsModel> {}

export class FinanceReportsRepository extends BaseRepository<IFinanceReportsModel> implements IFinanceReportsRepository {
  constructor() {
    super(FinanceReportsModel);
  }
}
