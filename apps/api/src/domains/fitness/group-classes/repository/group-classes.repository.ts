import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IGroupClassesModel, GroupClassesModel } from '../model/group-classes.model.js';

export interface IGroupClassesRepository extends IBaseRepository<IGroupClassesModel> {}

export class GroupClassesRepository extends BaseRepository<IGroupClassesModel> implements IGroupClassesRepository {
  constructor() {
    super(GroupClassesModel);
  }
}
