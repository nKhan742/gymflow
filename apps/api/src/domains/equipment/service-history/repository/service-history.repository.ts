import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IServiceHistoryModel, ServiceHistoryModel } from '../model/service-history.model.js';

export interface IServiceHistoryRepository extends IBaseRepository<IServiceHistoryModel> {}

export class ServiceHistoryRepository extends BaseRepository<IServiceHistoryModel> implements IServiceHistoryRepository {
  constructor() {
    super(ServiceHistoryModel);
  }
}
