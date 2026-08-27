import { ITransformationModel } from '../model/transformation.model.js';
import { ITransformation } from '../interfaces/transformation.interface.js';

export class TransformationMapper {
  static toDTO(model: ITransformationModel): ITransformation {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || model.title || `Transformation for ${model.memberName || model.memberCode}`,
      code: model.code || 'TRF-001',
      description: model.description,
      memberId: model.memberId,
      memberCode: model.memberCode || 'GF-1001',
      memberName: model.memberName || 'Gym Member',
      planTier: model.planTier || 'VIP_PLATINUM',
      category: model.category || 'FAT_LOSS_SHRED',
      title: model.title || 'Incredible Fitness Transformation',
      durationMonths: model.durationMonths || 6,
      beforeWeightKg: model.beforeWeightKg || 80,
      afterWeightKg: model.afterWeightKg || 70,
      weightChangeKg: model.weightChangeKg ?? -10,
      beforeBodyFat: model.beforeBodyFat || 28,
      afterBodyFat: model.afterBodyFat || 18,
      bodyFatChange: model.bodyFatChange ?? -10,
      waistChangeCm: model.waistChangeCm ?? -8,
      beforePhoto: model.beforePhoto,
      afterPhoto: model.afterPhoto,
      story: model.story || 'Consistent nutrition and functional strength training.',
      coachName: model.coachName || 'Coach Alex Vance',
      isFeatured: model.isFeatured ?? false,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
