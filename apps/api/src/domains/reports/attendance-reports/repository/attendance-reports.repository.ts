import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IAttendanceReportsModel, AttendanceReportsModel } from '../model/attendance-reports.model.js';

export interface IAttendanceReportsRepository extends IBaseRepository<IAttendanceReportsModel> {}

export class AttendanceReportsRepository extends BaseRepository<IAttendanceReportsModel> implements IAttendanceReportsRepository {
  constructor() {
    super(AttendanceReportsModel);
  }
}
