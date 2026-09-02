import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions } from '../../../../database/base.model.js';

export interface IDaySchedule {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface IWorkingHoursModel extends IBaseModel {
  name: string;
  code: string;
  zoneType: 'MAIN_GYM' | 'SPA_RECOVERY' | 'SWIMMING_POOL' | 'STUDIO_ROOM' | 'SMOOTHIE_BAR' | 'CHILDCARE';
  is24x7: boolean;
  weeklySchedule: IDaySchedule[];
  peakHoursStart?: string;
  peakHoursEnd?: string;
  maxCapacity?: number;
  maintenanceWindow?: string;
  branchId?: string;
  branchName?: string;
  status: 'active' | 'inactive';
  description?: string;
  metadata?: Record<string, unknown>;
}

const dayScheduleSchema = new Schema(
  {
    day: { type: String, required: true },
    isOpen: { type: Boolean, default: true },
    openTime: { type: String, default: '05:30' },
    closeTime: { type: String, default: '23:00' },
  },
  { _id: false }
);

const workingHoursSchema = new Schema<IWorkingHoursModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, required: true, index: true },
    zoneType: {
      type: String,
      enum: ['MAIN_GYM', 'SPA_RECOVERY', 'SWIMMING_POOL', 'STUDIO_ROOM', 'SMOOTHIE_BAR', 'CHILDCARE'],
      default: 'MAIN_GYM',
    },
    is24x7: { type: Boolean, default: false },
    weeklySchedule: [dayScheduleSchema],
    peakHoursStart: { type: String, default: '17:30' },
    peakHoursEnd: { type: String, default: '20:30' },
    maxCapacity: { type: Number, default: 150 },
    maintenanceWindow: { type: String },
    branchId: { type: String, default: 'ALL', index: true },
    branchName: { type: String, default: 'All Locations' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    description: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  baseSchemaOptions
);

export const WorkingHoursModel = model<IWorkingHoursModel>('WorkingHours', workingHoursSchema);
