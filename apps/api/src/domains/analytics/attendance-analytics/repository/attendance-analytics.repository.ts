import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IAttendanceAnalyticsModel, AttendanceAnalyticsModel } from '../model/attendance-analytics.model.js';

export interface IAttendanceAnalyticsRepository extends IBaseRepository<IAttendanceAnalyticsModel> {}

export class AttendanceAnalyticsRepository extends BaseRepository<IAttendanceAnalyticsModel> implements IAttendanceAnalyticsRepository {
  constructor() {
    super(AttendanceAnalyticsModel);
  }
}
