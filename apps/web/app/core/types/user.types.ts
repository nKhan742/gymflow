import { IBaseEntity } from './common.types';
import { RoleType, PermissionType } from './rbac.types';

export interface IUserProfile extends IBaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  role: RoleType;
  permissions: (PermissionType | string)[];
  branchId?: string;
  gymId?: string;
  gymName?: string;
  campusName?: string;
  isActive: boolean;
}

export interface IAuthSession {
  user: IUserProfile;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}
