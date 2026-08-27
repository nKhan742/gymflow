import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IBranchesModel, BranchesModel } from '../model/branches.model.js';

export interface IBranchesRepository extends IBaseRepository<IBranchesModel> {}

export class BranchesRepository extends BaseRepository<IBranchesModel> implements IBranchesRepository {
  constructor() {
    super(BranchesModel);
  }
}
