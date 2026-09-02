import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IDepartmentsModel extends IBaseModel {
  name: string;
  code: string;
  category?: string;
  description?: string;
  icon?: string;
  color?: string;
  headOfDepartment?: {
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
  };
  headcount?: number;
  monthlyBudget?: number;
  actualSpend?: number;
  revenueGenerating?: boolean;
  glCode?: string;
  branchId?: string;
  branchName?: string;
  shifts?: string[];
  status: StatusType;
  metadata?: Record<string, unknown>;
}

export const departmentsSchema = new Schema<IDepartmentsModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, required: true, unique: true, index: true },
    category: { type: String, default: 'FITNESS' },
    description: { type: String, default: '' },
    icon: { type: String, default: 'Dumbbell' },
    color: { type: String, default: '#6366f1' },
    headOfDepartment: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      avatar: { type: String, default: '' },
    },
    headcount: { type: Number, default: 0 },
    monthlyBudget: { type: Number, default: 25000 },
    actualSpend: { type: Number, default: 21000 },
    revenueGenerating: { type: Boolean, default: true },
    glCode: { type: String, default: 'GL-6001' },
    branchId: { type: String, default: 'ALL' },
    branchName: { type: String, default: 'All Branches' },
    shifts: { type: [String], default: ['Morning', 'Evening'] },
    metadata: { type: Schema.Types.Mixed },
  },
  baseSchemaOptions
);

export const DepartmentsModel = model<IDepartmentsModel>('Departments', departmentsSchema);
