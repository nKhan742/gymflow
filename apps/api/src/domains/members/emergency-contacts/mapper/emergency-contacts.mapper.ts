import { IEmergencyContactsModel } from '../model/emergency-contacts.model.js';
import { IEmergencyContacts } from '../interfaces/emergency-contacts.interface.js';

export class EmergencyContactsMapper {
  static toDTO(model: IEmergencyContactsModel): IEmergencyContacts {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || `Emergency Contact for ${model.memberName || model.memberCode}`,
      code: model.code || 'EMG-001',
      description: model.description,
      memberId: model.memberId,
      memberCode: model.memberCode || 'GF-1001',
      memberName: model.memberName || 'Gym Member',
      planTier: model.planTier || 'VIP_PLATINUM',
      contactName: model.contactName || 'Emergency Contact',
      relationship: model.relationship || 'SPOUSE',
      priority: model.priority || 'PRIMARY',
      phone: model.phone || '+1 (555) 000-0000',
      alternatePhone: model.alternatePhone,
      email: model.email,
      address: model.address,
      isMedicalProxy: model.isMedicalProxy ?? true,
      preferredHospital: model.preferredHospital || 'City Memorial Hospital',
      verificationStatus: model.verificationStatus || 'VERIFIED',
      notes: model.notes,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
