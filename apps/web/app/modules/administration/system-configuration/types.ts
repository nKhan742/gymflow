export interface IMicroserviceStatus {
  serviceName: string;
  serviceKey: string;
  status: 'HEALTHY' | 'DEGRADED' | 'STANDBY' | 'STOPPED';
  latencyMs: number;
  instances: number;
  uptime: string;
}

export interface ISystemConfigurationModel {
  id?: string;
  _id?: string;
  nodeEnv: 'PRODUCTION' | 'STAGING' | 'DISASTER_RECOVERY';
  regionCluster: string;
  s3StorageBucket: string;
  cdnDistributionDomain: string;
  databaseLatencyMs: number;
  redisCacheHitRate: number;
  serverUptimePercent: number;
  activeWebsocketConnections: number;
  memoryHeapUsagePercent: number;
  cpuLoadPercent: number;
  autoScaleReplicaMin: number;
  autoScaleReplicaMax: number;
  dbPoolConnections: number;
  services: IMicroserviceStatus[];
}

export interface ISystemConfigurationFilters {
  search?: string;
  status?: string;
}
