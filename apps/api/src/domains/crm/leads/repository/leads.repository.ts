import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { ILeadsModel, LeadsModel } from '../model/leads.model.js';

export interface ILeadsRepository extends IBaseRepository<ILeadsModel> {}

export class LeadsRepository extends BaseRepository<ILeadsModel> implements ILeadsRepository {
  constructor() {
    super(LeadsModel);
  }
}
