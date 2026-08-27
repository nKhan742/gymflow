import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { ITrainerCommissionModel, TrainerCommissionModel } from '../model/trainer-commission.model.js';

export interface ITrainerCommissionRepository extends IBaseRepository<ITrainerCommissionModel> {}

export class TrainerCommissionRepository extends BaseRepository<ITrainerCommissionModel> implements ITrainerCommissionRepository {
  constructor() {
    super(TrainerCommissionModel);
  }
}
