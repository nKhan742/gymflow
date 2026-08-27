import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { ISalaryModel, SalaryModel } from '../model/salary.model.js';

export interface ISalaryRepository extends IBaseRepository<ISalaryModel> {}

export class SalaryRepository extends BaseRepository<ISalaryModel> implements ISalaryRepository {
  constructor() {
    super(SalaryModel);
  }
}
