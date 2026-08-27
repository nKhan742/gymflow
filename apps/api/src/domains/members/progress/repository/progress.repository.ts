import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IProgressModel, ProgressModel } from '../model/progress.model.js';

export interface IProgressRepository extends IBaseRepository<IProgressModel> {}

export class ProgressRepository extends BaseRepository<IProgressModel> implements IProgressRepository {
  constructor() {
    super(ProgressModel);
  }
}
