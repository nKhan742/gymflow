import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IAttendanceModel, AttendanceModel } from '../model/attendance.model.js';

export interface IAttendanceRepository extends IBaseRepository<IAttendanceModel> {}

export class AttendanceRepository extends BaseRepository<IAttendanceModel> implements IAttendanceRepository {
  constructor() {
    super(AttendanceModel);
  }
}
