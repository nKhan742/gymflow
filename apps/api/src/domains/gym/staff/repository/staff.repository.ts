import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IStaffModel, StaffModel } from '../model/staff.model.js';

export interface IStaffRepository extends IBaseRepository<IStaffModel> {}

export class StaffRepository extends BaseRepository<IStaffModel> implements IStaffRepository {
  constructor() {
    super(StaffModel);
  }
}
