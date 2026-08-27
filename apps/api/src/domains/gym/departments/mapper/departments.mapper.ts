import { IDepartmentsModel } from '../model/departments.model.js';
import { IDepartments } from '../interfaces/departments.interface.js';

export class DepartmentsMapper {
  static toDTO(model: IDepartmentsModel): IDepartments {
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
