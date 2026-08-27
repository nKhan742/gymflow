import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IShiftManagementModel, ShiftManagementModel } from '../model/shift-management.model.js';

export interface IShiftManagementRepository extends IBaseRepository<IShiftManagementModel> {}

export class ShiftManagementRepository extends BaseRepository<IShiftManagementModel> implements IShiftManagementRepository {
  constructor() {
    super(ShiftManagementModel);
  }
}
