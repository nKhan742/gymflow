export interface IPermissionModel {
  id: string;
  _id?: string;
  permissionName: string;
  permissionCode: string;
  moduleDomain: string;
  actionType: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'SIGN_OFF';
  description: string;
  iconAvatarUrl?: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  grantedRolesCount: number;
  isSystemProtected: boolean;
  status: 'ACTIVE' | 'RESTRICTED';
  createdAt: string;
  updatedAt: string;
}

export interface IPermissionModelFilters {
  search?: string;
  moduleDomain?: string;
  riskLevel?: string;
  status?: string;
}
