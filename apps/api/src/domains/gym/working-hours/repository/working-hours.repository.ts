import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IWorkingHoursModel, WorkingHoursModel } from '../model/working-hours.model.js';

export interface IWorkingHoursRepository extends IBaseRepository<IWorkingHoursModel> {}

export class WorkingHoursRepository extends BaseRepository<IWorkingHoursModel> implements IWorkingHoursRepository {
  constructor() {
    super(WorkingHoursModel);
  }
}
