import { ITaxesModel } from '../model/taxes.model.js';
import { ITaxes } from '../interfaces/taxes.interface.js';

export class TaxesMapper {
  static toDTO(model: ITaxesModel): ITaxes {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || model.taxName || `Tax Rate ${model.taxCode || model.code}`,
      code: model.code || model.taxCode || 'TAX-001',
      taxCode: model.taxCode || 'TAX-10',
      taxName: model.taxName || 'Sales Tax',
      description: model.description,
      taxRate: model.taxRate ?? 10,
      taxType: model.taxType || 'STANDARD_SALES_TAX',
      calculationMethod: model.calculationMethod || 'EXCLUSIVE',
      applicableCategory: model.applicableCategory || 'ALL_MEMBERSHIPS',
      taxRegistrationNumber: model.taxRegistrationNumber || 'EIN-84-9201948',
      isDefault: model.isDefault ?? false,
      isActive: model.isActive ?? true,
      effectiveFrom: model.effectiveFrom || model.createdAt,
      notes: model.notes,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
