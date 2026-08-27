import { ITasksModel } from '../model/tasks.model.js';
import { ITasks } from '../interfaces/tasks.interface.js';

export class TasksMapper {
  static toDTO(model: ITasksModel): ITasks {
    return {
      id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name,
      code: model.code,
      description: model.description,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
