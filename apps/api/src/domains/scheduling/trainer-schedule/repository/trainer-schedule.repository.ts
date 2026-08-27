import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { ITrainerScheduleModel, TrainerScheduleModel } from '../model/trainer-schedule.model.js';

export interface ITrainerScheduleRepository extends IBaseRepository<ITrainerScheduleModel> {}

export class TrainerScheduleRepository extends BaseRepository<ITrainerScheduleModel> implements ITrainerScheduleRepository {
  constructor() {
    super(TrainerScheduleModel);
  }
}
