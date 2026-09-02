import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions } from '../../../../database/base.model.js';

export interface IHolidaysModel extends IBaseModel {
  name: string;
  code?: string;
  startDate: string;
  endDate: string;
  category: 'NATIONAL' | 'MAINTENANCE' | 'SPECIAL_EVENT' | 'EMERGENCY';
  operationalMode: 'CLOSED' | 'REDUCED_HOURS' | 'SELF_SERVICE';
  reducedHoursSchedule?: string;
  classPolicy: 'AUTO_CANCEL' | 'RESCHEDULE' | 'KEEP_SCHEDULED';
  ptPolicy: 'AUTO_CANCEL' | 'PERMITTED';
  branchId?: string;
  branchName?: string;
  memberBroadcast: boolean;
  status: 'active' | 'archived';
  description?: string;
  metadata?: Record<string, unknown>;
}

const holidaysSchema = new Schema<IHolidaysModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    startDate: { type: String, required: true, index: true },
    endDate: { type: String, required: true },
    category: {
      type: String,
      enum: ['NATIONAL', 'MAINTENANCE', 'SPECIAL_EVENT', 'EMERGENCY'],
      default: 'NATIONAL',
    },
    operationalMode: {
      type: String,
      enum: ['CLOSED', 'REDUCED_HOURS', 'SELF_SERVICE'],
      default: 'CLOSED',
    },
    reducedHoursSchedule: { type: String },
    classPolicy: {
      type: String,
      enum: ['AUTO_CANCEL', 'RESCHEDULE', 'KEEP_SCHEDULED'],
      default: 'AUTO_CANCEL',
    },
    ptPolicy: {
      type: String,
      enum: ['AUTO_CANCEL', 'PERMITTED'],
      default: 'AUTO_CANCEL',
    },
    branchId: { type: String, default: 'ALL', index: true },
    branchName: { type: String, default: 'All Locations' },
    memberBroadcast: { type: Boolean, default: true },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
    description: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  baseSchemaOptions
);

export const HolidaysModel = model<IHolidaysModel>('Holidays', holidaysSchema);
