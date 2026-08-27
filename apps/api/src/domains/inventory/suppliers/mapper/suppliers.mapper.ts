import { ISuppliersModel } from '../model/suppliers.model.js';
import { ISuppliers } from '../interfaces/suppliers.interface.js';

export class SuppliersMapper {
  static toDTO(model: ISuppliersModel): ISuppliers {
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
