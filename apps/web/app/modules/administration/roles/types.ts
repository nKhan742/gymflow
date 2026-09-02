export interface IRoleModel {
  id: string;
  _id?: string;
  roleName: string;
  roleKey: string;
  description: string;
  iconAvatarUrl?: string;
  isSystemRole: boolean;
  assignedUsersCount: number;
  permissionModulesCount: number;
  permissionsList: string[];
  hierarchyTier: number;
  status: 'ACTIVE' | 'ARCHIVED';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRoleModelFilters {
  search?: string;
  status?: string;
  isSystemRole?: boolean;
}
