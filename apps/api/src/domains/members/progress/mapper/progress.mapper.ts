import { IProgressModel } from '../model/progress.model.js';
import { IProgress } from '../interfaces/progress.interface.js';

export class ProgressMapper {
  static toDTO(model: IProgressModel): IProgress {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || `Progress for ${model.memberName || model.memberCode}`,
      code: model.code || 'PRG-001',
      description: model.description,
      memberId: model.memberId,
      memberCode: model.memberCode || 'GF-1001',
      memberName: model.memberName || 'Gym Member',
      planTier: model.planTier || 'VIP_PLATINUM',
      primaryGoal: model.primaryGoal || 'STRENGTH_HYPERTROPHY',
      goalTitle: model.goalTitle || '12-Week Transformation',
      targetDate: model.targetDate || new Date(),
      progressPercent: model.progressPercent ?? 50,
      milestonesCompleted: model.milestonesCompleted ?? 3,
      totalMilestones: model.totalMilestones ?? 5,
      benchPressKg: model.benchPressKg ?? 75,
      squatKg: model.squatKg ?? 110,
      deadliftKg: model.deadliftKg ?? 130,
      adherencePercent: model.adherencePercent ?? 90,
      progressStatus: model.progressStatus || 'ON_TRACK',
      assignedCoach: model.assignedCoach || 'Coach Alex Vance',
      coachFeedback: model.coachFeedback,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
