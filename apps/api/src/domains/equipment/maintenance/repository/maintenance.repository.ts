import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IMaintenanceModel, MaintenanceModel } from '../model/maintenance.model.js';

export interface IMaintenanceRepository extends IBaseRepository<IMaintenanceModel> {}

export class MaintenanceRepository extends BaseRepository<IMaintenanceModel> implements IMaintenanceRepository {
  constructor() {
    super(MaintenanceModel);
  }
}
