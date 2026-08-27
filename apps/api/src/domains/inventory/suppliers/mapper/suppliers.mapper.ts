import { ISuppliersModel } from '../model/suppliers.model.js';
import { ISuppliers } from '../interfaces/suppliers.interface.js';

export class SuppliersMapper {
  static toDTO(model: ISuppliersModel): ISuppliers {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || model.companyName || 'Supplier',
      code: model.code || model.supplierCode || 'SUP-001',
      supplierCode: model.supplierCode || 'SUP-001',
      companyName: model.companyName || 'Supplier Inc.',
      contactPerson: model.contactPerson || 'Vendor Lead',
      email: model.email || 'vendor@supplements.com',
      phone: model.phone || '+1 (800) 000-0000',
      address: model.address,
      categoriesSupplied: model.categoriesSupplied || 'Supplements',
      paymentTerms: model.paymentTerms || 'NET_30',
      rating: model.rating ?? 5.0,
      totalOrdersPlaced: model.totalOrdersPlaced ?? 0,
      totalSpend: model.totalSpend ?? 0,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
