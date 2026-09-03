import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IUsersModel extends IBaseModel {
  name?: string;
  code?: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'BRANCH_MANAGER' | 'TRAINER' | 'RECEPTIONIST' | 'NUTRITIONIST' | 'MEMBER' | 'ACCOUNTANT';
  permissions: string[];
  branchId?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  status: StatusType;
}

export const usersSchema = new Schema<IUsersModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String },
    code: { type: String },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER', 'TRAINER', 'RECEPTIONIST', 'NUTRITIONIST', 'MEMBER', 'ACCOUNTANT'],
      default: 'ADMIN',
      index: true,
    },
    permissions: [{ type: String }],
    branchId: { type: String, default: 'branch_hq_01' },
    phone: { type: String },
    avatar: { type: String },
    isActive: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived', 'draft', 'suspended'],
      default: 'active',
      index: true,
    },
  },
  baseSchemaOptions
);

export const UsersModel = model<IUsersModel>('Users', usersSchema);
