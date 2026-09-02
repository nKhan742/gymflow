import { IBranchesModel } from '../model/branches.model.js';
import { IBranches } from '../interfaces/branches.interface.js';

export class BranchesMapper {
  static toDTO(model: IBranchesModel): IBranches {
    const raw = model.toObject ? model.toObject() : model;
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      name: model.name,
      code: model.code,
      tagline: model.tagline,
      image: model.image,
      phone: model.phone,
      email: model.email,
      sqFt: model.sqFt,
      capacity: model.capacity,
      currentOccupancy: model.currentOccupancy,
      memberCount: model.memberCount,
      staffCount: model.staffCount,
      turnstileCount: model.turnstileCount,
      monthlyRevenue: model.monthlyRevenue,
      address: model.address,
      manager: model.manager,
      operatingHours: model.operatingHours,
      amenities: model.amenities,
      status: model.status,
      metadata: model.metadata,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      ...raw,
    };
  }
}
