export class AuditLogsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class AuditLogsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class AuditLogsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
