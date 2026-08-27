import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IPersonalTrainingModel, PersonalTrainingModel } from '../model/personal-training.model.js';

export interface IPersonalTrainingRepository extends IBaseRepository<IPersonalTrainingModel> {}

export class PersonalTrainingRepository extends BaseRepository<IPersonalTrainingModel> implements IPersonalTrainingRepository {
  constructor() {
    super(PersonalTrainingModel);
  }
}
