export interface IFitnessAssessment {
  id: string;
  _id?: string;
  assessmentCode: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  assessorCoachId: string;
  assessorCoachName: string;
  assessmentDate: string;
  weightKg: number;
  bodyFatPercentage: number;
  skeletalMuscleMassKg: number;
  visceralFatScore: number;
  benchPress1RMKg?: number;
  squat1RMKg?: number;
  deadlift1RMKg?: number;
  vo2MaxScore?: number;
  postureScreenNotes?: string;
  status: 'COMPLETED' | 'PENDING_REVIEW' | 'FLAGGED';
  branchId?: string;
  branchName?: string;
  createdAt?: string;
  updatedAt?: string;
}
