export interface IActivityLogModel {
  id: string;
  _id?: string;
  actorName: string;
  actorEmail: string;
  actorAvatarUrl?: string;
  actorRole: string;
  actionEvent: string;
  moduleDomain: string;
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  statusCode: number;
  ipAddress: string;
  deviceAgent: string;
  locationCampus: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  timestamp: string;
  metadataPayload?: string;
}

export interface IActivityLogModelFilters {
  search?: string;
  severity?: string;
  moduleDomain?: string;
  httpMethod?: string;
}
