import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions } from '../../../../database/base.model.js';

export interface IRolesModel extends IBaseModel {
  name: string;
  roleName?: string;
  code?: string;
  roleKey?: string;
  description?: string;
  hierarchyTier?: number;
  isSystemRole?: boolean;
  assignedUsersCount?: number;
  permissionModulesCount?: number;
  permissionsList?: string[];
  permissions?: string[];
  metadata?: Record<string, unknown>;
}

export const rolesSchema = new Schema<IRolesModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    roleName: { type: String },
    code: { type: String, index: true },
    roleKey: { type: String, index: true },
    description: { type: String },
    hierarchyTier: { type: Number, default: 3 },
    isSystemRole: { type: Boolean, default: false },
    assignedUsersCount: { type: Number, default: 0 },
    permissionModulesCount: { type: Number, default: 0 },
    permissionsList: [{ type: String }],
    permissions: [{ type: String }],
    status: { type: String, default: 'ACTIVE' },
    metadata: { type: Schema.Types.Mixed },
  },
  baseSchemaOptions
);

export const RolesModel = model<IRolesModel>('Roles', rolesSchema);
