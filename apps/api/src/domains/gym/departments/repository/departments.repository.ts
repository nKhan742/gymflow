import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IDepartmentsModel, DepartmentsModel } from '../model/departments.model.js';

export interface IDepartmentsRepository extends IBaseRepository<IDepartmentsModel> {}

export class DepartmentsRepository extends BaseRepository<IDepartmentsModel> implements IDepartmentsRepository {
  constructor() {
    super(DepartmentsModel);
  }
}
