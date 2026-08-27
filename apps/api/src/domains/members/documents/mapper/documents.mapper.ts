import { IDocumentsModel } from '../model/documents.model.js';
import { IDocuments } from '../interfaces/documents.interface.js';

export class DocumentsMapper {
  static toDTO(model: IDocumentsModel): IDocuments {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || model.title || `Document for ${model.memberName || model.memberCode}`,
      code: model.code || 'DOC-001',
      description: model.description,
      memberId: model.memberId,
      memberCode: model.memberCode || 'GF-1001',
      memberName: model.memberName || 'Gym Member',
      planTier: model.planTier || 'VIP_PLATINUM',
      documentType: model.documentType || 'MEMBERSHIP_CONTRACT',
      title: model.title || 'Membership Agreement',
      fileName: model.fileName || 'document.pdf',
      fileSize: model.fileSize || '1.8 MB',
      fileFormat: model.fileFormat || 'PDF',
      fileUrl: model.fileUrl,
      verificationStatus: model.verificationStatus || 'VERIFIED',
      uploadDate: model.uploadDate || model.createdAt,
      expiryDate: model.expiryDate,
      verifiedBy: model.verifiedBy || 'Manager Alex Vance',
      notes: model.notes,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
