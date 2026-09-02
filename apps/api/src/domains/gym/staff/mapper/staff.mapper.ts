import { IStaffModel } from '../model/staff.model.js';
import { IStaff } from '../interfaces/staff.interface.js';

export class StaffMapper {
  static toDTO(model: IStaffModel): IStaff {
    return {
      id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || `${model.firstName} ${model.lastName}`,
      code: model.code,
      firstName: model.firstName,
      lastName: model.lastName,
      email: model.email,
      phone: model.phone,
      avatar: model.avatar,
      bio: model.bio,
      role: model.role,
      department: model.department,
      specializations: model.specializations || [],
      certifications: model.certifications || [],
      shift: model.shift,
      hourlyRate: model.hourlyRate,
      salary: model.salary,
      commissionPercentage: model.commissionPercentage,
      hireDate: model.hireDate,
      rating: model.rating,
      reviewsCount: model.reviewsCount,
      activeClientsCount: model.activeClientsCount,
      workingDays: model.workingDays || [],
      emergencyContact: model.emergencyContact,
      status: model.status as any,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
