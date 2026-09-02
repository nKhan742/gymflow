export interface IAuditLogModel {
  id: string;
  _id?: string;
  auditRecordNumber: string;
  mutationType: 'CREATE' | 'UPDATE' | 'DELETE' | 'FORCE_OVERRIDE' | 'STATUS_CHANGE';
  entityType: 'INVOICE' | 'MEMBER' | 'PERMISSION' | 'SHIFT' | 'TURNSTILE_GATE' | 'PRODUCT';
  entityId: string;
  entityLabel: string;
  changedBy: string;
  changedByEmail: string;
  changedByAvatarUrl?: string;
  changedByRole: string;
  beforeStateJson: string;
  afterStateJson: string;
  complianceCategory: 'SOX_FINANCIAL' | 'GDPR_PII' | 'HIPAA_HEALTH' | 'INTERNAL_GOVERNANCE';
  hashSignature: string;
  timestamp: string;
  status: 'VERIFIED' | 'FLAGGED' | 'UNDER_REVIEW';
}

export interface IAuditLogModelFilters {
  search?: string;
  mutationType?: string;
  entityType?: string;
  complianceCategory?: string;
  status?: string;
}
