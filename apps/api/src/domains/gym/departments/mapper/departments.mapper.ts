import { IDepartmentsModel } from '../model/departments.model.js';
import { IDepartments } from '../interfaces/departments.interface.js';

export class DepartmentsMapper {
  static toDTO(model: IDepartmentsModel): IDepartments {
    const raw = model.toObject ? model.toObject() : model;
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      name: model.name,
      code: model.code,
      category: model.category,
      description: model.description,
      icon: model.icon,
      color: model.color,
      headOfDepartment: model.headOfDepartment,
      headcount: model.headcount,
      monthlyBudget: model.monthlyBudget,
      actualSpend: model.actualSpend,
      revenueGenerating: model.revenueGenerating,
      glCode: model.glCode,
      branchId: model.branchId,
      branchName: model.branchName,
      shifts: model.shifts,
      status: model.status,
      metadata: model.metadata,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      ...raw,
    };
  }
}
