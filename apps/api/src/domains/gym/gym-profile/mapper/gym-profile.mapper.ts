import { IGymProfileModel } from '../model/gym-profile.model.js';
import { IGymProfile } from '../interfaces/gym-profile.interface.js';

export class GymProfileMapper {
  static toDTO(model: IGymProfileModel): IGymProfile {
    const raw = model.toObject ? model.toObject() : model;
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name,
      code: model.code,
      tagline: model.tagline,
      description: model.description,
      logo: model.logo,
      coverImage: model.coverImage,
      taxId: model.taxId,
      businessLicense: model.businessLicense,
      foundedYear: model.foundedYear,
      currency: model.currency,
      defaultTaxRate: model.defaultTaxRate,
      invoiceHeader: model.invoiceHeader,
      invoiceFooter: model.invoiceFooter,
      is24x7: model.is24x7,
      maxCapacity: model.maxCapacity,
      currentOccupancy: model.currentOccupancy,
      address: model.address,
      contacts: model.contacts,
      operatingHours: model.operatingHours,
      amenities: model.amenities,
      zones: model.zones,
      accessControl: model.accessControl,
      status: model.status,
      metadata: model.metadata,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      ...raw,
    };
  }
}
