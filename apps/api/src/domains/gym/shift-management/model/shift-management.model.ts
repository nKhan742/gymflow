import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions } from '../../../../database/base.model.js';

export interface IShiftManagementModel extends IBaseModel {
  name: string;
  code: string;
  departmentId?: string;
  departmentName?: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  breakDurationMins?: number;
  minHeadcount: number;
  daysOfWeek: string[];
  gracePeriodMins?: number;
  overtimeMultiplier?: number;
  color?: string;
  branchId?: string;
  branchName?: string;
  status: 'active' | 'inactive';
  description?: string;
  assignedStaffCount?: number;
  metadata?: Record<string, unknown>;
}

export const shiftManagementSchema = new Schema<IShiftManagementModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, required: true, index: true },
    departmentId: { type: String },
    departmentName: { type: String },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    durationHours: { type: Number, required: true, default: 8.0 },
    breakDurationMins: { type: Number, default: 60 },
    minHeadcount: { type: Number, required: true, default: 2 },
    daysOfWeek: [{ type: String }],
    gracePeriodMins: { type: Number, default: 15 },
    overtimeMultiplier: { type: Number, default: 1.5 },
    color: { type: String, default: '#3B82F6' },
    branchId: { type: String, default: 'ALL', index: true },
    branchName: { type: String, default: 'All Locations' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    description: { type: String },
    assignedStaffCount: { type: Number, default: 0 },
    metadata: { type: Schema.Types.Mixed },
  },
  baseSchemaOptions
);

export const ShiftManagementModel = model<IShiftManagementModel>('ShiftManagement', shiftManagementSchema);
