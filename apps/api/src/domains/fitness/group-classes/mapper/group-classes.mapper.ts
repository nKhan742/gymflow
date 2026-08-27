import { IGroupClassesModel } from '../model/group-classes.model.js';
import { IGroupClasses } from '../interfaces/group-classes.interface.js';

export class GroupClassesMapper {
  static toDTO(model: IGroupClassesModel): IGroupClasses {
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
