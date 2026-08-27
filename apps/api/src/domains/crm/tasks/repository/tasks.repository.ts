import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { ITasksModel, TasksModel } from '../model/tasks.model.js';

export interface ITasksRepository extends IBaseRepository<ITasksModel> {}

export class TasksRepository extends BaseRepository<ITasksModel> implements ITasksRepository {
  constructor() {
    super(TasksModel);
  }
}
