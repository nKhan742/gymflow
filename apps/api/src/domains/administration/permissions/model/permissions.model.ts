import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions } from '../../../../database/base.model.js';

export interface IPermissionsModel extends IBaseModel {
  name: string;
  code?: string;
  permissionName?: string;
  permissionCode?: string;
  moduleDomain?: string;
  actionType?: string;
  riskLevel?: string;
  grantedRolesCount?: number;
  isSystemProtected?: boolean;
  iconAvatarUrl?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export const permissionsSchema = new Schema<IPermissionsModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    permissionName: { type: String },
    permissionCode: { type: String },
    moduleDomain: { type: String },
    actionType: { type: String },
    riskLevel: { type: String },
    grantedRolesCount: { type: Number, default: 0 },
    isSystemProtected: { type: Boolean, default: false },
    iconAvatarUrl: { type: String },
    description: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  baseSchemaOptions
);

export const PermissionsModel = model<IPermissionsModel>('Permissions', permissionsSchema);
