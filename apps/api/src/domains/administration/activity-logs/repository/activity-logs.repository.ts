import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IActivityLogsModel, ActivityLogsModel } from '../model/activity-logs.model.js';

export interface IActivityLogsRepository extends IBaseRepository<IActivityLogsModel> {}

export class ActivityLogsRepository extends BaseRepository<IActivityLogsModel> implements IActivityLogsRepository {
  constructor() {
    super(ActivityLogsModel);
  }
}
