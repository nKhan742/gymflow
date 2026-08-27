import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface ILeadsModel extends IBaseModel {
  name: string;
  code?: string;
  description?: string;
  email: string;
  phone: string;
  source: 'WEBSITE' | 'WALK_IN' | 'INSTAGRAM' | 'REFERRAL' | 'GOOGLE_ADS';
  stage: 'NEW' | 'CONTACTED' | 'TRIAL_BOOKED' | 'VISITED' | 'CONVERTED' | 'LOST';
  assignedAgent: string;
  trialDate?: string;
  notes?: string;
  status: StatusType;
}

const leadsSchema = new Schema<ILeadsModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String },
    description: { type: String },
    email: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    source: {
      type: String,
      enum: ['WEBSITE', 'WALK_IN', 'INSTAGRAM', 'REFERRAL', 'GOOGLE_ADS'],
      default: 'WEBSITE',
    },
    stage: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'TRIAL_BOOKED', 'VISITED', 'CONVERTED', 'LOST'],
      default: 'NEW',
      index: true,
    },
    assignedAgent: { type: String, default: 'Alex Vance' },
    trialDate: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived', 'draft', 'suspended'],
      default: 'active',
      index: true,
    },
  },
  baseSchemaOptions
);

export const LeadsModel = model<ILeadsModel>('Leads', leadsSchema);
