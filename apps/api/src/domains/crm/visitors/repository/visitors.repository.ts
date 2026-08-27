import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IVisitorsModel, VisitorsModel } from '../model/visitors.model.js';

export interface IVisitorsRepository extends IBaseRepository<IVisitorsModel> {}

export class VisitorsRepository extends BaseRepository<IVisitorsModel> implements IVisitorsRepository {
  constructor() {
    super(VisitorsModel);
  }
}
