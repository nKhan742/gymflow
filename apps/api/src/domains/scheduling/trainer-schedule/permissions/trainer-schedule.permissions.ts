export const TRAINER_SCHEDULE_PERMISSIONS = {
  VIEW: 'scheduling:trainer-schedule:view',
  CREATE: 'scheduling:trainer-schedule:create',
  UPDATE: 'scheduling:trainer-schedule:update',
  DELETE: 'scheduling:trainer-schedule:delete',
  EXPORT: 'scheduling:trainer-schedule:export',
  IMPORT: 'scheduling:trainer-schedule:import',
} as const;

export type TrainerSchedulePermissionType = typeof TRAINER_SCHEDULE_PERMISSIONS[keyof typeof TRAINER_SCHEDULE_PERMISSIONS];
